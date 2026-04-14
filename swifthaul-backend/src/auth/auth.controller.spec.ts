import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import type { Response } from 'express';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { JwtPayload, RefreshTokenRequest, UserResponse } from './types/jwt-payload.type';

const mockUserResponse: UserResponse = {
  name: 'Admin User',
  email: 'admin@test.com',
  role: Role.ADMIN,
  avatarUrl: null,
  mustResetPassword: false,
};

const mockRes = { cookie: jest.fn(), clearCookie: jest.fn() } as unknown as Response;

const mockUser: JwtPayload = {
  sub: 'user-1',
  email: 'admin@test.com',
  role: Role.ADMIN,
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: {
    register: jest.Mock;
    login: jest.Mock;
    me: jest.Mock;
    refresh: jest.Mock;
    logout: jest.Mock;
    invite: jest.Mock;
    acceptInvite: jest.Mock;
    changePassword: jest.Mock;
    forgotPassword: jest.Mock;
    resetPassword: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      register: jest.fn(),
      login: jest.fn(),
      me: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
      invite: jest.fn(),
      acceptInvite: jest.fn(),
      changePassword: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  // register
  describe('register', () => {
    it('delegates to authService.register and returns the result', async () => {
      const dto = { name: 'Admin', email: 'new@test.com', password: 'pass', secret: 'sec' };
      const expected = { message: 'Admin account created successfully.' };
      service.register.mockResolvedValue(expected);
      const result = await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // login
  describe('login', () => {
    it('delegates to authService.login with dto and response object', async () => {
      const dto = { email: 'admin@test.com', password: 'pass' };
      service.login.mockResolvedValue(mockUserResponse);
      const result = await controller.login(dto, mockRes);
      expect(service.login).toHaveBeenCalledWith(dto, mockRes);
      expect(result).toEqual(mockUserResponse);
    });
  });

  // current user
  describe('me', () => {
    it('delegates to authService.me with the current user payload', async () => {
      service.me.mockResolvedValue(mockUserResponse);
      const result = await controller.me(mockUser);
      expect(service.me).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUserResponse);
    });
  });

  // refresh token
  describe('refresh', () => {
    it('delegates to authService.refresh with request and response', async () => {
      const mockReq = {
        user: { refreshToken: 'token', payload: mockUser },
      } as RefreshTokenRequest;
      service.refresh.mockResolvedValue(mockUserResponse);
      const result = await controller.refresh(mockReq, mockRes);
      expect(service.refresh).toHaveBeenCalledWith(mockReq, mockRes);
      expect(result).toEqual(mockUserResponse);
    });
  });

  // logout
  describe('logout', () => {
    it('delegates to authService.logout with userId and response', async () => {
      const expected = { message: 'Logged out successfully.' };
      service.logout.mockResolvedValue(expected);
      const result = await controller.logout(mockUser, mockRes);
      expect(service.logout).toHaveBeenCalledWith(mockUser.sub, mockRes);
      expect(result).toEqual(expected);
    });
  });

  // invite user
  describe('invite', () => {
    it('delegates to authService.invite and returns the result', async () => {
      const dto = { email: 'driver@test.com', role: Role.DRIVER };
      const expected = { message: 'Invite sent successfully.' };
      service.invite.mockResolvedValue(expected);
      const result = await controller.invite(dto);
      expect(service.invite).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // accept invite
  describe('acceptInvite', () => {
    it('delegates to authService.acceptInvite and returns the result', async () => {
      const dto = { token: 'tok', name: 'Driver', password: 'pass' };
      const expected = { message: 'Account activated. You can now log in.' };
      service.acceptInvite.mockResolvedValue(expected);
      const result = await controller.acceptInvite(dto);
      expect(service.acceptInvite).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // change password
  describe('changePassword', () => {
    it('delegates to authService.changePassword with dto and userId', async () => {
      const dto = { currentPassword: 'old', newPassword: 'new' };
      const expected = { message: 'Password updated successfully.' };
      service.changePassword.mockResolvedValue(expected);
      const result = await controller.changePassword(dto, mockUser);
      expect(service.changePassword).toHaveBeenCalledWith(dto, mockUser.sub);
      expect(result).toEqual(expected);
    });
  });

  // forgot password
  describe('forgotPassword', () => {
    it('delegates to authService.forgotPassword and returns the result', async () => {
      const dto = { email: 'admin@test.com' };
      const expected = { message: 'If that email is registered, a reset code has been sent.' };
      service.forgotPassword.mockResolvedValue(expected);
      const result = await controller.forgotPassword(dto);
      expect(service.forgotPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // reset password
  describe('resetPassword', () => {
    it('delegates to authService.resetPassword and returns the result', async () => {
      const dto = { email: 'admin@test.com', otp: '123456', newPassword: 'newpass' };
      const expected = { message: 'Password reset successfully.' };
      service.resetPassword.mockResolvedValue(expected);
      const result = await controller.resetPassword(dto);
      expect(service.resetPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });
});
