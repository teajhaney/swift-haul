import { Test, TestingModule } from '@nestjs/testing';
import { Availability, OrderStatus, Priority, Role } from '@prisma/client';

import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CannotDeleteActiveOrderException,
  DriverAtCapacityException,
  DriverNotFoundException,
  DriverUnavailableException,
  ForbiddenResourceException,
  InvalidTransitionException,
  OrderNotFoundException,
  OrderNotEditableException,
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

const mockDriverProfile = {
  userId: 'driver-1',
  availability: Availability.AVAILABLE,
  maxConcurrentOrders: 5,
  vehicleType: 'CAR',
  vehiclePlate: 'ABC-123',
};
const mockDriver = {
  id: 'driver-1',
  name: 'Driver One',
  avatarUrl: null,
  role: Role.DRIVER,
  isActive: true,
  driverProfile: mockDriverProfile,
};

// minimal order shape returned by queries without includes
const baseOrderRaw = {
  id: 'order-1',
  referenceId: 'SH-ABC1234',
  status: OrderStatus.PENDING,
  driverId: null,
  dispatcherId: 'admin-1',
};

// full shape returned when includes are present (used in toOrderDetail mapper)
const baseOrderFull = {
  ...baseOrderRaw,
  trackingToken: 'track-token-1',
  priority: Priority.STANDARD,
  senderName: 'Alice',
  senderPhone: '+1234567890',
  recipientName: 'Bob',
  recipientPhone: '+0987654321',
  recipientEmail: null,
  pickupAddress: '123 Main St',
  pickupLat: null,
  pickupLng: null,
  deliveryAddress: '456 Oak Ave',
  deliveryLat: null,
  deliveryLng: null,
  packageDescription: 'Box of items',
  weightKg: null,
  dimensions: null,
  notes: null,
  scheduledPickupTime: null,
  estimatedDelivery: null,
  failedAttempts: 0,
  maxRetries: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
  driver: null,
  dispatcher: { id: 'admin-1', name: 'Admin' },
  statusLogs: [],
};

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: {
    order: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    user: { findFirst: jest.Mock };
    orderStatusLog: { create: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      order: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: { findFirst: jest.fn() },
      orderStatusLog: { create: jest.fn() },
      $transaction: jest.fn().mockImplementation((arg: unknown) => {
        if (typeof arg === 'function') {
          return (arg as (tx: typeof prisma) => Promise<unknown>)(prisma);
        }
        return Promise.all(arg as Promise<unknown>[]);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    it('generates a referenceId with SH- prefix', async () => {
      prisma.order.findUnique.mockResolvedValueOnce(null); // no collision on referenceId check
      prisma.order.create.mockResolvedValue(baseOrderFull);
      await service.create(
        {
          senderName: 'Alice',
          senderPhone: '+1234567890',
          recipientName: 'Bob',
          recipientPhone: '+0987654321',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Box',
        },
        'admin-1',
      );
      expect(prisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            referenceId: expect.stringMatching(/^SH-[A-Z0-9]{7}$/),
          }),
        }),
      );
    });

    it('retries referenceId generation on collision', async () => {
      prisma.order.findUnique
        .mockResolvedValueOnce({ id: 'existing' }) // first attempt collides
        .mockResolvedValueOnce(null); // second attempt is unique
      prisma.order.create.mockResolvedValue(baseOrderFull);
      await service.create(
        {
          senderName: 'Alice',
          senderPhone: '+1234567890',
          recipientName: 'Bob',
          recipientPhone: '+0987654321',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Oak Ave',
          packageDescription: 'Box',
        },
        'admin-1',
      );
      expect(prisma.order.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAll', () => {
    it("scopes the query to the caller's driverId for DRIVER role", async () => {
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(0);
      await service.findAll({}, driverUser);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ driverId: driverUser.sub }),
        }),
      );
    });

    it('does not scope by driverId for ADMIN role', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      prisma.order.count.mockResolvedValue(0);
      await service.findAll({}, adminUser);
      const call = prisma.order.findMany.mock.calls[0][0] as {
        where: Record<string, unknown>;
      };
      expect(call.where.driverId).toBeUndefined();
    });

    it('returns paginated result with correct meta', async () => {
      prisma.order.findMany.mockResolvedValue([baseOrderFull]);
      prisma.order.count.mockResolvedValue(25);
      const result = await service.findAll({ page: 2, limit: 10 }, adminUser);
      expect(result.meta).toMatchObject({ total: 25, page: 2, limit: 10 });
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('throws OrderNotFoundException when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.findOne('SH-NOTFOUND', adminUser)).rejects.toThrow(
        OrderNotFoundException,
      );
    });

    it("throws ForbiddenResourceException when DRIVER accesses another driver's order", async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderFull,
        driverId: 'other-driver',
      });
      await expect(service.findOne('SH-ABC1234', driverUser)).rejects.toThrow(
        ForbiddenResourceException,
      );
    });

    it('allows DRIVER to access their own order', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderFull,
        driverId: driverUser.sub,
      });
      const result = await service.findOne('SH-ABC1234', driverUser);
      expect(result.referenceId).toBe(baseOrderFull.referenceId);
    });

    it('returns full order detail for ADMIN', async () => {
      prisma.order.findUnique.mockResolvedValue(baseOrderFull);
      const result = await service.findOne('SH-ABC1234', adminUser);
      expect(result.referenceId).toBe(baseOrderFull.referenceId);
      expect(result.statusLogs).toEqual([]);
    });
  });

  describe('update', () => {
    it('throws OrderNotFoundException when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.update('SH-NOTFOUND', {})).rejects.toThrow(
        OrderNotFoundException,
      );
    });

    it('throws OrderNotEditableException for non-editable statuses', async () => {
      const nonEditableStatuses = [
        OrderStatus.ACCEPTED,
        OrderStatus.PICKED_UP,
        OrderStatus.IN_TRANSIT,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
      ];
      for (const status of nonEditableStatuses) {
        prisma.order.findUnique.mockResolvedValue({ ...baseOrderRaw, status });
        await expect(
          service.update('SH-ABC1234', { senderName: 'New Name' }),
        ).rejects.toThrow(OrderNotEditableException);
      }
    });

    it('allows edits when order is PENDING, ASSIGNED, or RESCHEDULED', async () => {
      const editableStatuses = [
        OrderStatus.PENDING,
        OrderStatus.ASSIGNED,
        OrderStatus.RESCHEDULED,
      ];
      for (const status of editableStatuses) {
        prisma.order.findUnique.mockResolvedValue({ ...baseOrderRaw, status });
        prisma.order.update.mockResolvedValue(baseOrderFull);
        await expect(
          service.update('SH-ABC1234', { senderName: 'Updated' }),
        ).resolves.toBeDefined();
      }
    });

    it('passes only provided fields to Prisma update', async () => {
      prisma.order.findUnique.mockResolvedValue(baseOrderRaw);
      prisma.order.update.mockResolvedValue(baseOrderFull);
      await service.update('SH-ABC1234', { senderName: 'New Sender' });
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ senderName: 'New Sender' }),
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('throws OrderNotFoundException when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(
        service.updateStatus(
          'SH-NOTFOUND',
          { status: OrderStatus.CANCELLED },
          adminUser,
        ),
      ).rejects.toThrow(OrderNotFoundException);
    });

    it("throws ForbiddenResourceException when DRIVER updates another driver's order", async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderRaw,
        driverId: 'other-driver',
      });
      await expect(
        service.updateStatus(
          'SH-ABC1234',
          { status: OrderStatus.ACCEPTED },
          driverUser,
        ),
      ).rejects.toThrow(ForbiddenResourceException);
    });

    it('throws InvalidTransitionException for invalid state machine transitions', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderRaw,
        status: OrderStatus.PENDING,
      });
      await expect(
        service.updateStatus(
          'SH-ABC1234',
          { status: OrderStatus.DELIVERED },
          adminUser,
        ),
      ).rejects.toThrow(InvalidTransitionException);
    });

    it('updates order status and creates a status log in a transaction', async () => {
      prisma.order.findUnique
        .mockResolvedValueOnce({ ...baseOrderRaw, status: OrderStatus.PENDING })
        .mockResolvedValueOnce(baseOrderFull); // findOne call after update
      prisma.order.update.mockResolvedValue(baseOrderFull);
      prisma.orderStatusLog.create.mockResolvedValue({});
      await service.updateStatus(
        'SH-ABC1234',
        { status: OrderStatus.CANCELLED },
        adminUser,
      );
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: OrderStatus.CANCELLED },
        }),
      );
      expect(prisma.orderStatusLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fromStatus: OrderStatus.PENDING,
            toStatus: OrderStatus.CANCELLED,
          }),
        }),
      );
    });
  });

  describe('assignDriver', () => {
    it('throws OrderNotFoundException when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(
        service.assignDriver(
          'SH-NOTFOUND',
          { driverId: 'driver-1' },
          adminUser,
        ),
      ).rejects.toThrow(OrderNotFoundException);
    });

    it('throws InvalidTransitionException when order is not PENDING or RESCHEDULED', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderRaw,
        status: OrderStatus.IN_TRANSIT,
      });
      await expect(
        service.assignDriver('SH-ABC1234', { driverId: 'driver-1' }, adminUser),
      ).rejects.toThrow(InvalidTransitionException);
    });

    it('throws DriverNotFoundException when driver does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(baseOrderRaw);
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(
        service.assignDriver('SH-ABC1234', { driverId: 'missing' }, adminUser),
      ).rejects.toThrow(DriverNotFoundException);
    });

    it('throws DriverUnavailableException when driver is OFFLINE', async () => {
      prisma.order.findUnique.mockResolvedValue(baseOrderRaw);
      prisma.user.findFirst.mockResolvedValue({
        ...mockDriver,
        driverProfile: {
          ...mockDriverProfile,
          availability: Availability.OFFLINE,
        },
      });
      await expect(
        service.assignDriver('SH-ABC1234', { driverId: 'driver-1' }, adminUser),
      ).rejects.toThrow(DriverUnavailableException);
    });

    it('throws DriverAtCapacityException when driver has reached max concurrent orders', async () => {
      prisma.order.findUnique.mockResolvedValue(baseOrderRaw);
      prisma.user.findFirst.mockResolvedValue(mockDriver); // maxConcurrentOrders = 5
      prisma.order.count.mockResolvedValue(5);
      await expect(
        service.assignDriver('SH-ABC1234', { driverId: 'driver-1' }, adminUser),
      ).rejects.toThrow(DriverAtCapacityException);
    });

    it('assigns driver and writes a status log on success', async () => {
      prisma.order.findUnique
        .mockResolvedValueOnce(baseOrderRaw)
        .mockResolvedValueOnce(baseOrderFull); // findOne after assign
      prisma.user.findFirst.mockResolvedValue(mockDriver);
      prisma.order.count.mockResolvedValue(2); // under capacity
      prisma.order.update.mockResolvedValue(baseOrderFull);
      prisma.orderStatusLog.create.mockResolvedValue({});
      await service.assignDriver(
        'SH-ABC1234',
        { driverId: 'driver-1' },
        adminUser,
      );
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            driverId: 'driver-1',
            status: OrderStatus.ASSIGNED,
          }),
        }),
      );
      expect(prisma.orderStatusLog.create).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('throws OrderNotFoundException when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.remove('SH-NOTFOUND')).rejects.toThrow(
        OrderNotFoundException,
      );
    });

    it('throws CannotDeleteActiveOrderException for non-terminal statuses', async () => {
      const nonTerminalStatuses = [
        OrderStatus.PENDING,
        OrderStatus.ASSIGNED,
        OrderStatus.ACCEPTED,
        OrderStatus.IN_TRANSIT,
        OrderStatus.FAILED,
        OrderStatus.RESCHEDULED,
      ];
      for (const status of nonTerminalStatuses) {
        prisma.order.findUnique.mockResolvedValue({ ...baseOrderRaw, status });
        await expect(service.remove('SH-ABC1234')).rejects.toThrow(
          CannotDeleteActiveOrderException,
        );
      }
    });

    it('deletes a DELIVERED order and returns a success message', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderRaw,
        status: OrderStatus.DELIVERED,
      });
      prisma.order.delete.mockResolvedValue(baseOrderRaw);
      const result = await service.remove('SH-ABC1234');
      expect(prisma.order.delete).toHaveBeenCalledWith({
        where: { id: baseOrderRaw.id },
      });
      expect(result.message).toBeDefined();
    });

    it('deletes a CANCELLED order and returns a success message', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderRaw,
        status: OrderStatus.CANCELLED,
      });
      prisma.order.delete.mockResolvedValue(baseOrderRaw);
      const result = await service.remove('SH-ABC1234');
      expect(result.message).toBeDefined();
    });
  });

  describe('findByTrackingToken', () => {
    it('throws OrderNotFoundException when token does not match any order', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.findByTrackingToken('bad-token')).rejects.toThrow(
        OrderNotFoundException,
      );
    });

    it('returns public tracking data without sensitive fields', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...baseOrderFull,
        driver: { name: 'Driver One', driverProfile: { vehicleType: 'CAR' } },
      });
      const result = await service.findByTrackingToken('track-token-1');
      expect(result.referenceId).toBe(baseOrderFull.referenceId);
      expect(result.status).toBe(baseOrderFull.status);
      expect(result.driver).toMatchObject({
        name: 'Driver One',
        vehicleType: 'CAR',
      });
    });
  });
});
