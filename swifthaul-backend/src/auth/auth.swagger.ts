import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InviteDto } from './dto/invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// Applied to the AuthController class
export const ApiAuthController = () => applyDecorators(ApiTags('Auth'));

// POST /auth/login
export const ApiLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Login with email and password' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: 200,
      description:
        'Login successful. Access and refresh tokens set as HttpOnly cookies.',
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials.' }),
    ApiResponse({ status: 403, description: 'Account is inactive.' }),
  );

// GET /auth/me
export const ApiMe = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Get the currently authenticated user' }),
    ApiResponse({ status: 200, description: 'Current user data.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
  );

// POST /auth/refresh
export const ApiRefresh = () =>
  applyDecorators(
    ApiCookieAuth('refreshToken'),
    ApiOperation({ summary: 'Rotate tokens using the refresh token cookie' }),
    ApiResponse({
      status: 200,
      description: 'Tokens rotated. New access and refresh cookies set.',
    }),
    ApiResponse({
      status: 401,
      description: 'Refresh token is invalid or expired.',
    }),
  );

// POST /auth/logout
export const ApiLogout = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Logout and clear auth cookies' }),
    ApiResponse({ status: 200, description: 'Logged out. Cookies cleared.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
  );

// POST /auth/invite
export const ApiInvite = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Invite a new user by email (ADMIN only)' }),
    ApiBody({ type: InviteDto }),
    ApiResponse({ status: 201, description: 'Invite email sent.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
    ApiResponse({ status: 409, description: 'Email already registered.' }),
  );

// POST /auth/accept-invite
export const ApiAcceptInvite = () =>
  applyDecorators(
    ApiOperation({ summary: 'Accept an invite and activate your account' }),
    ApiBody({ type: AcceptInviteDto }),
    ApiResponse({ status: 201, description: 'Account activated.' }),
    ApiResponse({
      status: 400,
      description: 'vehicleType and vehiclePlate required for DRIVER role.',
    }),
    ApiResponse({ status: 401, description: 'Invite token is invalid.' }),
  );

// POST /auth/change-password
export const ApiChangePassword = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Change password — also clears the mustResetPassword flag',
    }),
    ApiBody({ type: ChangePasswordDto }),
    ApiResponse({ status: 200, description: 'Password updated.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Current password is incorrect.' }),
  );

// POST /auth/forgot-password
export const ApiForgotPassword = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Request a password-reset OTP via email',
      description:
        'Always returns 200 regardless of whether the email is registered — prevents email enumeration.',
    }),
    ApiBody({ type: ForgotPasswordDto }),
    ApiResponse({ status: 200, description: 'OTP sent if the email exists.' }),
  );

// POST /auth/reset-password
export const ApiResetPassword = () =>
  applyDecorators(
    ApiOperation({ summary: 'Reset password using the OTP received by email' }),
    ApiBody({ type: ResetPasswordDto }),
    ApiResponse({ status: 200, description: 'Password reset successfully.' }),
    ApiResponse({
      status: 401,
      description: 'OTP is invalid or has expired (5-min TTL).',
    }),
  );

// POST /auth/register
export const ApiRegister = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create an ADMIN account (developer backdoor)',
      description:
        'Requires SIGNUP_SECRET in the request body matching the SIGNUP_SECRET env var. Not for public use.',
    }),
    ApiBody({ type: RegisterDto }),
    ApiResponse({ status: 201, description: 'Admin account created.' }),
    ApiResponse({ status: 403, description: 'Invalid signup secret.' }),
    ApiResponse({ status: 409, description: 'Email already registered.' }),
  );
