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
import {
  ApiAuthController,
  ApiLogin,
  ApiMe,
  ApiRefresh,
  ApiLogout,
  ApiInvite,
  ApiAcceptInvite,
  ApiChangePassword,
  ApiForgotPassword,
  ApiResetPassword,
  ApiRegister,
} from './auth.swagger';

@Controller('auth')
@ApiAuthController()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiLogin()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    return this.authService.login(dto, res);
  }

  @Get('me')
  @ApiMe()
  async me(@CurrentUser() user: JwtPayload): Promise<UserResponse> {
    return this.authService.me(user);
  }

  @Post('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  @ApiRefresh()
  async refresh(
    @Req() req: RefreshTokenRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @ApiLogout()
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return this.authService.logout(user.sub, res);
  }

  @Post('invite')
  @AdminOnly()
  @ApiInvite()
  async invite(@Body() dto: InviteDto): Promise<{ message: string }> {
    return this.authService.invite(dto);
  }

  @Post('accept-invite')
  @Public()
  @ApiAcceptInvite()
  async acceptInvite(
    @Body() dto: AcceptInviteDto,
  ): Promise<{ message: string }> {
    return this.authService.acceptInvite(dto);
  }

  @Post('change-password')
  @ApiChangePassword()
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(dto, user.sub);
  }

  @Post('forgot-password')
  @Public()
  @ApiForgotPassword()
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Public()
  @ApiResetPassword()
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(dto);
  }

  @Post('register')
  @Public()
  @ApiRegister()
  async register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(dto);
  }
}
