import { Test, TestingModule } from '@nestjs/testing';
import { NotificationType, OrderStatus, Role } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: {
    notification: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      updateMany: jest.Mock;
    };
    user: { findUnique: jest.Mock; findMany: jest.Mock };
    order: { findUnique: jest.Mock };
  };
  let gateway: {
    notifyUser: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        updateMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
      order: {
        findUnique: jest.fn(),
      },
    };

    gateway = {
      notifyUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: NotificationsGateway, useValue: gateway },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save notification and emit socket event', async () => {
      const dto = {
        userId: 'u-1',
        title: 'Test',
        body: 'Body',
        type: NotificationType.SYSTEM_UPDATE,
      };

      const mockSaved = {
        id: 'n-1',
        ...dto,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        orderId: null,
      };
      prisma.notification.create.mockResolvedValue(mockSaved);

      await service.create(dto);

      expect(prisma.notification.create).toHaveBeenCalled();
      expect(gateway.notifyUser).toHaveBeenCalledWith('u-1', expect.objectContaining({ title: dto.title }));
    });
  });

  describe('notifyStatusChanged', () => {
    it('should notify both staff and the assigned driver', async () => {
      const orderId = 'o-1';
      const refId = 'SH-123';
      const status = OrderStatus.DELIVERED;
      const actingUserId = 'admin-1';

      prisma.user.findMany.mockResolvedValue([{ id: 'staff-1', role: Role.ADMIN }]);
      prisma.order.findUnique.mockResolvedValue({
        id: orderId,
        referenceId: refId,
        driverId: 'driver-1',
      });

      prisma.notification.create.mockResolvedValue({});

      await service.notifyStatusChanged(
        orderId,
        refId,
        status,
        'Admin',
        actingUserId,
      );

      // Should notify staff
      expect(prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: 'staff-1' }),
        }),
      );
      // Should notify assigned driver
      expect(prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: 'driver-1' }),
        }),
      );
    });
  });
});
