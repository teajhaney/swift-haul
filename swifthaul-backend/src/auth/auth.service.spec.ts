import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import {
  AccountInactiveException,
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  InvalidInviteTokenException,
  InvalidOtpException,
  PasswordMismatchException,
  UserNotFoundException,
} from '../common/exceptions/domain.exceptions';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockRes = {
  cookie: jest.fn(),
  clearCookie: jest.fn(),
} as unknown as Response;

const mockUser = {
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@test.com',
  role: Role.ADMIN,
  passwordHash: 'hashed_value',
  refreshTokenHash: 'hashed_refresh',
  isActive: true,
  mustResetPassword: false,
  avatarUrl: null,
  inviteToken: null,
  inviteAccepted: true,
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    driverProfile: { create: jest.Mock };
    $transaction: jest.Mock;
  };
  let config: { get: jest.Mock; getOrThrow: jest.Mock };
  let jwt: { sign: jest.Mock };
  let redis: { set: jest.Mock; get: jest.Mock; del: jest.Mock };
  let email: { send: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      driverProfile: { create: jest.fn() },
      $transaction: jest.fn().mockImplementation((arg: unknown) => {
        if (typeof arg === 'function') {
          return (arg as (tx: typeof prisma) => Promise<unknown>)(prisma);
        }
        return Promise.all(arg as Promise<unknown>[]);
      }),
    };
    config = {
      get: jest.fn(),
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    };
    jwt = { sign: jest.fn().mockReturnValue('signed-token') };
    redis = {
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn(),
      del: jest.fn().mockResolvedValue(1),
    };
    email = { send: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: ConfigService, useValue: config },
        { provide: JwtService, useValue: jwt },
        { provide: RedisService, useValue: redis },
        { provide: EmailService, useValue: email },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('throws ForbiddenException when secret does not match', async () => {
      config.get.mockReturnValue('correct-secret');
      await expect(
        service.register({
          name: 'Admin',
          email: 'new@test.com',
          password: 'password1',
          secret: 'wrong-secret',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws EmailAlreadyExistsException when email is taken', async () => {
      config.get.mockReturnValue('secret');
      prisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(
        service.register({
          name: 'Admin',
          email: 'admin@test.com',
          password: 'password1',
          secret: 'secret',
        }),
      ).rejects.toThrow(EmailAlreadyExistsException);
    });

    it('creates an ADMIN user and returns a success message', async () => {
      config.get.mockReturnValue('secret');
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      const result = await service.register({
        name: 'New Admin',
        email: 'new@test.com',
        password: 'password1',
        secret: 'secret',
      });
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ role: Role.ADMIN, isActive: true }),
        }),
      );
      expect(result.message).toBeDefined();
    });
  });

  describe('login', () => {
    it('throws InvalidCredentialsException when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.login({ email: 'unknown@test.com', password: 'pass' }, mockRes),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('throws AccountInactiveException when account is inactive', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false });
      await expect(
        service.login({ email: 'admin@test.com', password: 'pass' }, mockRes),
      ).rejects.toThrow(AccountInactiveException);
    });

    it('throws InvalidCredentialsException when password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(
        service.login({ email: 'admin@test.com', password: 'wrong' }, mockRes),
      ).rejects.toThrow(InvalidCredentialsException);
    });

    it('sets two HttpOnly cookies and returns user data on success', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUser);
      const result = await service.login(
        { email: 'admin@test.com', password: 'pass' },
        mockRes,
      );
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toMatchObject({ email: mockUser.email, role: mockUser.role });
    });
  });

  describe('me', () => {
    it('throws UserNotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.me({ sub: 'missing', email: 'x@test.com', role: Role.ADMIN }),
      ).rejects.toThrow(UserNotFoundException);
    });

    it('returns user response for a valid payload', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.me({
        sub: 'user-1',
        email: 'admin@test.com',
        role: Role.ADMIN,
      });
      expect(result).toMatchObject({ email: mockUser.email, role: mockUser.role });
    });
  });

  describe('logout', () => {
    it('clears the refresh token hash and both cookies', async () => {
      prisma.user.update.mockResolvedValue(mockUser);
      const result = await service.logout('user-1', mockRes);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { refreshTokenHash: null } }),
      );
      expect(mockRes.clearCookie).toHaveBeenCalledTimes(2);
      expect(result.message).toBeDefined();
    });
  });

  describe('invite', () => {
    it('throws EmailAlreadyExistsException when email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      await expect(
        service.invite({ email: 'admin@test.com', role: Role.DRIVER }),
      ).rejects.toThrow(EmailAlreadyExistsException);
    });

    it('creates an inactive user and sends an invite email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ ...mockUser, isActive: false });
      config.getOrThrow.mockReturnValue('http://localhost:3000');
      const result = await service.invite({ email: 'driver@test.com', role: Role.DRIVER });
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isActive: false, inviteAccepted: false }),
        }),
      );
      expect(email.send).toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });
  });

  describe('acceptInvite', () => {
    it('throws InvalidInviteTokenException when token is not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(
        service.acceptInvite({ token: 'bad-token', name: 'Test', password: 'pass' }),
      ).rejects.toThrow(InvalidInviteTokenException);
    });

    it('throws InvalidInviteTokenException when invite was already accepted', async () => {
      prisma.user.findFirst.mockResolvedValue({ ...mockUser, inviteAccepted: true });
      await expect(
        service.acceptInvite({ token: 'tok', name: 'Test', password: 'pass' }),
      ).rejects.toThrow(InvalidInviteTokenException);
    });

    it('throws BadRequestException for a DRIVER invite missing vehicle info', async () => {
      prisma.user.findFirst.mockResolvedValue({
        ...mockUser,
        role: Role.DRIVER,
        isActive: false,
        inviteAccepted: false,
      });
      await expect(
        service.acceptInvite({ token: 'tok', name: 'Driver', password: 'pass' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('activates a non-driver user and returns success', async () => {
      const pendingUser = {
        ...mockUser,
        role: Role.DISPATCHER,
        isActive: false,
        inviteAccepted: false,
        inviteToken: 'tok',
      };
      prisma.user.findFirst.mockResolvedValue(pendingUser);
      prisma.user.update.mockResolvedValue(pendingUser);
      const result = await service.acceptInvite({
        token: 'tok',
        name: 'Dispatcher',
        password: 'newpassword',
      });
      expect(result.message).toBeDefined();
    });

    it('creates a DriverProfile when accepting a DRIVER invite', async () => {
      const pendingDriver = {
        ...mockUser,
        role: Role.DRIVER,
        isActive: false,
        inviteAccepted: false,
        inviteToken: 'tok',
      };
      prisma.user.findFirst.mockResolvedValue(pendingDriver);
      prisma.user.update.mockResolvedValue(pendingDriver);
      prisma.driverProfile.create.mockResolvedValue({});
      const result = await service.acceptInvite({
        token: 'tok',
        name: 'Driver',
        password: 'newpassword',
        vehicleType: 'CAR' as never,
        vehiclePlate: 'ABC-123',
      });
      expect(prisma.driverProfile.create).toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });
  });

  describe('changePassword', () => {
    it('throws UserNotFoundException when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.changePassword({ currentPassword: 'old', newPassword: 'new' }, 'missing'),
      ).rejects.toThrow(UserNotFoundException);
    });

    it('throws PasswordMismatchException when current password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(
        service.changePassword({ currentPassword: 'wrong', newPassword: 'new' }, 'user-1'),
      ).rejects.toThrow(PasswordMismatchException);
    });

    it('updates the password hash and returns success', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUser);
      const result = await service.changePassword(
        { currentPassword: 'old', newPassword: 'new' },
        'user-1',
      );
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ mustResetPassword: false }) }),
      );
      expect(result.message).toBeDefined();
    });
  });

  describe('forgotPassword', () => {
    it('returns success without storing OTP when email is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.forgotPassword({ email: 'unknown@test.com' });
      expect(redis.set).not.toHaveBeenCalled();
      expect(email.send).not.toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });

    it('stores OTP hash in Redis with 5-minute TTL and sends email', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      await service.forgotPassword({ email: 'admin@test.com' });
      expect(redis.set).toHaveBeenCalledWith(
        'otp:admin@test.com',
        expect.any(String),
        'EX',
        300,
      );
      expect(email.send).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('throws InvalidOtpException when no OTP exists in Redis', async () => {
      redis.get.mockResolvedValue(null);
      await expect(
        service.resetPassword({ email: 'admin@test.com', otp: '123456', newPassword: 'new' }),
      ).rejects.toThrow(InvalidOtpException);
    });

    it('throws InvalidOtpException when OTP does not match', async () => {
      redis.get.mockResolvedValue('hashed_otp');
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await expect(
        service.resetPassword({ email: 'admin@test.com', otp: 'wrong', newPassword: 'new' }),
      ).rejects.toThrow(InvalidOtpException);
    });

    it('updates password and deletes the OTP from Redis on success', async () => {
      redis.get.mockResolvedValue('hashed_otp');
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUser);
      const result = await service.resetPassword({
        email: 'admin@test.com',
        otp: '123456',
        newPassword: 'newpassword',
      });
      expect(prisma.user.update).toHaveBeenCalled();
      expect(redis.del).toHaveBeenCalledWith('otp:admin@test.com');
      expect(result.message).toBeDefined();
    });
  });
});
