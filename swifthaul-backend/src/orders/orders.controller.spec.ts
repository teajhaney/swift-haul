import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, Priority, Role } from '@prisma/client';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { OrderDetail, PaginatedOrders } from './types/order.types';

const adminUser: JwtPayload = {
  sub: 'admin-1',
  email: 'admin@test.com',
  role: Role.ADMIN,
};

const mockOrderDetail: OrderDetail = {
  referenceId: 'SH-ABC1234',
  trackingToken: 'track-token-1',
  status: OrderStatus.PENDING,
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
  packageDescription: 'Box',
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

const mockPaginatedOrders: PaginatedOrders = {
  data: [],
  meta: { total: 0, page: 1, limit: 10 },
};

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    updateStatus: jest.Mock;
    assignDriver: jest.Mock;
    remove: jest.Mock;
    findByTrackingToken: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      assignDriver: jest.fn(),
      remove: jest.fn(),
      findByTrackingToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: service }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  // create order
  describe('create', () => {
    it('delegates to ordersService.create with dto and userId', async () => {
      const dto = {
        senderName: 'Alice',
        senderPhone: '+1234567890',
        recipientName: 'Bob',
        recipientPhone: '+0987654321',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Oak Ave',
        packageDescription: 'Box',
      };
      service.create.mockResolvedValue(mockOrderDetail);
      const result = await controller.create(dto, adminUser);
      expect(service.create).toHaveBeenCalledWith(dto, adminUser.sub);
      expect(result).toEqual(mockOrderDetail);
    });
  });

  // list orders
  describe('findAll', () => {
    it('delegates to ordersService.findAll with query and user', async () => {
      const query = { page: 1, limit: 10 };
      service.findAll.mockResolvedValue(mockPaginatedOrders);
      const result = await controller.findAll(query, adminUser);
      expect(service.findAll).toHaveBeenCalledWith(query, adminUser);
      expect(result).toEqual(mockPaginatedOrders);
    });
  });

  // public tracking by token
  describe('track', () => {
    it('delegates to ordersService.findByTrackingToken with the token', async () => {
      const trackingData = {
        referenceId: 'SH-ABC1234',
        status: OrderStatus.PENDING,
        recipientName: 'Bob',
        deliveryAddress: '456 Oak Ave',
        estimatedDelivery: null,
        driver: null,
        statusLogs: [],
      };
      service.findByTrackingToken.mockResolvedValue(trackingData);
      const result = await controller.track('track-token-1');
      expect(service.findByTrackingToken).toHaveBeenCalledWith('track-token-1');
      expect(result).toEqual(trackingData);
    });
  });

  // order detail
  describe('findOne', () => {
    it('delegates to ordersService.findOne with referenceId and user', async () => {
      service.findOne.mockResolvedValue(mockOrderDetail);
      const result = await controller.findOne('SH-ABC1234', adminUser);
      expect(service.findOne).toHaveBeenCalledWith('SH-ABC1234', adminUser);
      expect(result).toEqual(mockOrderDetail);
    });
  });

  // update order
  describe('update', () => {
    it('delegates to ordersService.update with referenceId and dto', async () => {
      const dto = { senderName: 'Updated Name' };
      service.update.mockResolvedValue(mockOrderDetail);
      const result = await controller.update('SH-ABC1234', dto);
      expect(service.update).toHaveBeenCalledWith('SH-ABC1234', dto);
      expect(result).toEqual(mockOrderDetail);
    });
  });

  // update order status
  describe('updateStatus', () => {
    it('delegates to ordersService.updateStatus with referenceId, dto, and user', async () => {
      const dto = { status: OrderStatus.CANCELLED };
      service.updateStatus.mockResolvedValue(mockOrderDetail);
      const result = await controller.updateStatus('SH-ABC1234', dto, adminUser);
      expect(service.updateStatus).toHaveBeenCalledWith('SH-ABC1234', dto, adminUser);
      expect(result).toEqual(mockOrderDetail);
    });
  });

  // assign driver
  describe('assignDriver', () => {
    it('delegates to ordersService.assignDriver with referenceId, dto, and user', async () => {
      const dto = { driverId: 'driver-1' };
      service.assignDriver.mockResolvedValue(mockOrderDetail);
      const result = await controller.assignDriver('SH-ABC1234', dto, adminUser);
      expect(service.assignDriver).toHaveBeenCalledWith('SH-ABC1234', dto, adminUser);
      expect(result).toEqual(mockOrderDetail);
    });
  });

  // delete order
  describe('remove', () => {
    it('delegates to ordersService.remove with referenceId', async () => {
      const expected = { message: 'Order deleted.' };
      service.remove.mockResolvedValue(expected);
      const result = await controller.remove('SH-ABC1234');
      expect(service.remove).toHaveBeenCalledWith('SH-ABC1234');
      expect(result).toEqual(expected);
    });
  });
});
