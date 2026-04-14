import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { COOKIES, TOKEN_TTL } from '../common/constants/auth.constants';
import { AUTH_MESSAGES } from '../common/constants/messages';
import {
  AccountInactiveException,
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  InvalidInviteTokenException,
  InvalidOtpException,
  InvalidRefreshTokenException,
  PasswordMismatchException,
  UserNotFoundException,
} from '../common/exceptions/domain.exceptions';
import type {
  JwtPayload,
  RefreshTokenRequest,
  UserResponse,
} from './types/jwt-payload.type';
import type { LoginDto } from './dto/login.dto';
import type { InviteDto } from './dto/invite.dto';
import type { AcceptInviteDto } from './dto/accept-invite.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import type { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly email: EmailService,
  ) {}

  // register — developer backdoor to create an ADMIN account.
  // Requires SIGNUP_SECRET env var to match dto.secret. Never expose this publicly.
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const signupSecret = this.configService.get<string>('SIGNUP_SECRET');
    if (!signupSecret || dto.secret !== signupSecret) {
      throw new ForbiddenException(AUTH_MESSAGES.REGISTER_INVALID_SECRET);
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new EmailAlreadyExistsException();

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
        inviteAccepted: true,
        mustResetPassword: false,
      },
    });

    this.logger.log(`Admin account created via register for ${dto.email}`);
    return { message: AUTH_MESSAGES.REGISTER_SUCCESS as string };
  }

  //login
  async login(dto: LoginDto, res: Response): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new InvalidCredentialsException();
    if (!user.isActive) throw new AccountInactiveException();

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) throw new InvalidCredentialsException();

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    await this.issueTokens(payload, res);

    return this.buildUserResponse(user);
  }

  //current user
  async me(payload: JwtPayload): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UserNotFoundException();
    return this.buildUserResponse(user);
  }

  //refresh token
  async refresh(
    req: RefreshTokenRequest,
    res: Response,
  ): Promise<UserResponse> {
    const { refreshToken, payload } = req.user;

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshTokenHash)
      throw new InvalidRefreshTokenException();
    if (!user.isActive) throw new AccountInactiveException();

    const tokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!tokenValid) throw new InvalidRefreshTokenException();

    const newPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    await this.issueTokens(newPayload, res);

    return this.buildUserResponse(user);
  }

  //logout
  async logout(userId: string, res: Response): Promise<{ message: string }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    this.clearTokenCookies(res);
    return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
  }

  //invite
  async invite(dto: InviteDto): Promise<{ message: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new EmailAlreadyExistsException();

    const inviteToken = crypto.randomUUID();

    await this.prisma.user.create({
      data: {
        email: dto.email,
        role: dto.role,
        name: '',
        passwordHash: '',
        isActive: false,
        inviteToken,
        inviteAccepted: false,
        mustResetPassword: false,
      },
    });

    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const inviteUrl = `${frontendUrl}/accept-invite/${inviteToken}`;

    void this.email.send({
      to: dto.email,
      subject: AUTH_MESSAGES.INVITE_EMAIL_SUBJECT,
      html: AUTH_MESSAGES.INVITE_EMAIL_BODY(inviteUrl),
    });

    this.logger.log(
      'Invite entry created for ' + dto.email + ' with role ' + dto.role,
    );
    return { message: AUTH_MESSAGES.INVITE_SENT };
  }

  //accept invite
  async acceptInvite(dto: AcceptInviteDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { inviteToken: dto.token },
    });

    if (!user || user.inviteAccepted) throw new InvalidInviteTokenException();

    if (user.role === Role.DRIVER) {
      if (!dto.vehicleType || !dto.vehiclePlate) {
        throw new BadRequestException(AUTH_MESSAGES.DRIVER_PROFILE_REQUIRED);
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.prisma.$transaction(async (tx) => {
      const updateData: { [key: string]: unknown } = {
        name: dto.name,
        passwordHash,
        isActive: true,
        inviteToken: null,
        inviteAccepted: true,
      };

      if (dto.phone) {
        updateData.phone = dto.phone;
      }

      await tx.user.update({
        where: { id: user.id },
        data: updateData,
      });

      if (user.role === Role.DRIVER && dto.vehicleType && dto.vehiclePlate) {
        await tx.driverProfile.create({
          data: {
            userId: user.id,
            vehicleType: dto.vehicleType,
            vehiclePlate: dto.vehiclePlate,
          },
        });
      }
    });

    return { message: AUTH_MESSAGES.INVITE_ACCEPTED };
  }

  //chnage password
  async changePassword(
    dto: ChangePasswordDto,
    userId: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UserNotFoundException();

    const passwordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!passwordValid) throw new PasswordMismatchException();

    const newHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, mustResetPassword: false },
    });

    return { message: AUTH_MESSAGES.PASSWORD_CHANGED };
  }

  //forgot password
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Always return the same message — don't reveal whether the email exists.
    if (!user || !user.isActive) {
      return { message: AUTH_MESSAGES.FORGOT_PASSWORD_SENT };
    }

    const otp = Math.floor(100_000 + Math.random() * 900_000).toString();
    const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);

    await this.redis.set(`otp:${dto.email}`, otpHash, 'EX', 300);

    await this.email.send({
      to: dto.email,
      subject: AUTH_MESSAGES.OTP_EMAIL_SUBJECT,
      html: AUTH_MESSAGES.OTP_EMAIL_BODY(otp),
    });

    return { message: AUTH_MESSAGES.FORGOT_PASSWORD_SENT };
  }

  //reset password
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const otpHash = await this.redis.get(`otp:${dto.email}`);
    if (!otpHash) throw new InvalidOtpException();

    const otpValid = await bcrypt.compare(dto.otp, otpHash);
    if (!otpValid) throw new InvalidOtpException();

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UserNotFoundException();

    const newHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    await this.redis.del(`otp:${dto.email}`);
    return { message: AUTH_MESSAGES.PASSWORD_RESET };
  }

  //issue tokens
  private async issueTokens(payload: JwtPayload, res: Response): Promise<void> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: TOKEN_TTL.ACCESS_S,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: TOKEN_TTL.REFRESH_S,
    });

    const refreshHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { refreshTokenHash: refreshHash },
    });

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: TOKEN_TTL.ACCESS_MS,
    });

    res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: TOKEN_TTL.REFRESH_MS,
    });
  }

  //clearToken
  private clearTokenCookies(res: Response): void {
    res.clearCookie(COOKIES.ACCESS_TOKEN);
    res.clearCookie(COOKIES.REFRESH_TOKEN);
  }

  private buildUserResponse(user: {
    // id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl: string | null;
    mustResetPassword: boolean;
  }): UserResponse {
    return {
      //   id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      mustResetPassword: user.mustResetPassword,
    };
  }
}
