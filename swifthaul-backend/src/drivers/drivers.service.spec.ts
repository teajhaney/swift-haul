import { Test, TestingModule } from '@nestjs/testing';
import { Availability, Role, VehicleType } from '@prisma/client';

import { DriversService } from './drivers.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  DriverNotFoundException,
  ForbiddenResourceException,
} from '../common/exceptions/domain.exceptions';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

const adminUser: JwtPayload = {
  sub: 'admin-1',
  email: 'admin@test.com',
  role: Role.ADMIN,
};
const driverUser: JwtPayload = {
  sub: 'driver-1',
  email: 'driver@test.com',
  role: Role.DRIVER,
};

// lightweight Prisma Decimal mock
const decimal = (value: number) => ({ toNumber: () => value });

const mockDriverProfile = {
  id: 'profile-1',
  userId: 'driver-1',
  vehicleType: VehicleType.CAR,
  vehiclePlate: 'ABC-123',
  availability: Availability.AVAILABLE,
  currentLat: null,
  currentLng: null,
  locationUpdatedAt: null,
  maxConcurrentOrders: 5,
  rating: decimal(4.8),
  totalDeliveries: 42,
  completedToday: 3,
  successRate: decimal(95.5),
  memberSince: new Date('2025-01-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockDriverUser = {
  id: 'driver-1',
  name: 'Driver One',
  email: 'driver@test.com',
  phone: '+1234567890',
  avatarUrl: null,
  role: Role.DRIVER,
  isActive: true,
  passwordHash: 'hash',
  refreshTokenHash: null,
  mustResetPassword: false,
  inviteToken: null,
  inviteAccepted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  driverProfile: mockDriverProfile,
};

describe('DriversService', () => {
  let service: DriversService;
  let prisma: {
    user: { findMany: jest.Mock; count: jest.Mock; findFirst: jest.Mock };
    order: { count: jest.Mock };
    driverProfile: { update: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
      },
      order: { count: jest.fn() },
      driverProfile: { update: jest.fn() },
      $transaction: jest.fn().mockImplementation((arg: unknown) => {
        if (typeof arg === 'function') {
          return (arg as (tx: typeof prisma) => Promise<unknown>)(prisma);
        }
        return Promise.all(arg as Promise<unknown>[]);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DriversService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<DriversService>(DriversService);
  });

  describe('findAll', () => {
    it('returns paginated driver list', async () => {
      prisma.user.findMany.mockResolvedValue([mockDriverUser]);
      prisma.user.count.mockResolvedValue(1);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.meta).toMatchObject({ total: 1, page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 'driver-1',
        name: 'Driver One',
        availability: Availability.AVAILABLE,
        rating: 4.8,
        successRate: 95.5,
      });
    });

    it('applies availability filter to the query', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);
      await service.findAll({ availability: Availability.OFFLINE });
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            driverProfile: { is: { availability: Availability.OFFLINE } },
          }),
        }),
      );
    });

    it('applies search filter to name and email', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);
      await service.findAll({ search: 'alice' });
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.anything() }),
              expect.objectContaining({ email: expect.anything() }),
            ]),
          }),
        }),
      );
    });

    it('uses default page 1 and limit 10 when not provided', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);
      await service.findAll({});
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
    });
  });

  describe('findOne', () => {
    it("throws ForbiddenResourceException when DRIVER accesses another driver's profile", async () => {
      await expect(service.findOne('other-driver', driverUser)).rejects.toThrow(
        ForbiddenResourceException,
      );
    });

    it('throws DriverNotFoundException when driver does not exist', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.findOne('missing', adminUser)).rejects.toThrow(
        DriverNotFoundException,
      );
    });

    it('throws DriverNotFoundException when user has no driverProfile', async () => {
      prisma.user.findFirst.mockResolvedValue({
        ...mockDriverUser,
        driverProfile: null,
      });
      await expect(service.findOne('driver-1', adminUser)).rejects.toThrow(
        DriverNotFoundException,
      );
    });

    it('allows ADMIN to view any driver', async () => {
      prisma.user.findFirst.mockResolvedValue(mockDriverUser);
      prisma.order.count.mockResolvedValue(2);
      const result = await service.findOne('driver-1', adminUser);
      expect(result.id).toBe('driver-1');
      expect(result.activeOrders).toBe(2);
    });

    it('allows DRIVER to view their own profile', async () => {
      prisma.user.findFirst.mockResolvedValue(mockDriverUser);
      prisma.order.count.mockResolvedValue(1);
      const result = await service.findOne('driver-1', driverUser);
      expect(result.id).toBe('driver-1');
    });

    it('includes detail fields not present in the list item', async () => {
      prisma.user.findFirst.mockResolvedValue({
        ...mockDriverUser,
        driverProfile: {
          ...mockDriverProfile,
          currentLat: 51.5,
          currentLng: -0.1,
        },
      });
      prisma.order.count.mockResolvedValue(0);
      const result = await service.findOne('driver-1', adminUser);
      expect(result.currentLat).toBe(51.5);
      expect(result.currentLng).toBe(-0.1);
      expect(result.maxConcurrentOrders).toBe(5);
      expect(result.memberSince).toBeDefined();
    });
  });

  describe('updateAvailability', () => {
    it("throws ForbiddenResourceException when DRIVER updates another driver's availability", async () => {
      await expect(
        service.updateAvailability(
          'other-driver',
          { availability: Availability.BUSY },
          driverUser,
        ),
      ).rejects.toThrow(ForbiddenResourceException);
    });

    it('throws DriverNotFoundException when driver does not exist', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(
        service.updateAvailability(
          'driver-1',
          { availability: Availability.BUSY },
          driverUser,
        ),
      ).rejects.toThrow(DriverNotFoundException);
    });

    it('updates the driverProfile availability and returns updated detail', async () => {
      prisma.user.findFirst
        .mockResolvedValueOnce(mockDriverUser) // existence check
        .mockResolvedValueOnce({
          // findOne call after update
          ...mockDriverUser,
          driverProfile: {
            ...mockDriverProfile,
            availability: Availability.BUSY,
          },
        });
      prisma.driverProfile.update.mockResolvedValue({});
      prisma.order.count.mockResolvedValue(1);
      const result = await service.updateAvailability(
        'driver-1',
        { availability: Availability.BUSY },
        driverUser,
      );
      expect(prisma.driverProfile.update).toHaveBeenCalledWith({
        where: { userId: 'driver-1' },
        data: { availability: Availability.BUSY },
      });
      expect(result.availability).toBe(Availability.BUSY);
    });
  });
});
