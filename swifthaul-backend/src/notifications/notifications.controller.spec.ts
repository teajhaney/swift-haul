import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Role } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: {
    findAll: jest.Mock;
    markAsRead: jest.Mock;
    markAllAsRead: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: service }],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  describe('findAllForUser', () => {
    it('should throw ForbiddenException if driver tries to view another user', async () => {
      const user = { sub: 'driver-1', role: Role.DRIVER };
      await expect(
        controller.findAllForUser('other-user', {}, user as any)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow admin to view any user', async () => {
      const user = { sub: 'admin-1', role: Role.ADMIN };
      service.findAll.mockResolvedValue({ data: [], meta: {} });
      
      await controller.findAllForUser('driver-1', {}, user as any);
      
      expect(service.findAll).toHaveBeenCalledWith('driver-1', {});
    });
  });
});
