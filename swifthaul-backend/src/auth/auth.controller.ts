import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { InviteDto } from './dto/invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterDto } from './dto/register.dto';
import type {
  RefreshTokenRequest,
  UserResponse,
} from './types/jwt-payload.type';
import { Public } from '../common/decorators/public.decorator';
import { AdminOnly } from '../common/decorators/admin.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import type { JwtPayload } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login — no JWT required
  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    return this.authService.login(dto, res);
  }

  // GET /auth/me — any authenticated user
  @Get('me')
  async me(@CurrentUser() user: JwtPayload): Promise<UserResponse> {
    return this.authService.me(user);
  }

  // POST /auth/refresh — access token may be expired; use refresh token cookie instead
  @Post('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: RefreshTokenRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    return this.authService.refresh(req, res);
  }

  // POST /auth/logout — any authenticated user
  @Post('logout')
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return this.authService.logout(user.sub, res);
  }

  // POST /auth/invite — ADMIN only
  @Post('invite')
  @AdminOnly()
  async invite(@Body() dto: InviteDto): Promise<{ message: string }> {
    return this.authService.invite(dto);
  }

  // POST /auth/accept-invite — public (invited user has no account yet)
  @Post('accept-invite')
  @Public()
  async acceptInvite(
    @Body() dto: AcceptInviteDto,
  ): Promise<{ message: string }> {
    return this.authService.acceptInvite(dto);
  }

  // POST /auth/change-password — any authenticated user (used in mustResetPassword flow)
  @Post('change-password')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(dto, user.sub);
  }

  // POST /auth/forgot-password — public; always returns 200 to avoid email enumeration
  @Post('forgot-password')
  @Public()
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto);
  }

  // POST /auth/reset-password — public; verifies OTP then sets new password
  @Post('reset-password')
  @Public()
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(dto);
  }

  // POST /auth/register — developer backdoor to create an ADMIN account.
  // Requires SIGNUP_SECRET in the request body. Not for public use.
  @Post('register')
  @Public()
  async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(dto);
  }
}
