import { Test, TestingModule } from '@nestjs/testing';
import { Availability, Role, VehicleType } from '@prisma/client';

import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { DriverDetail, PaginatedDrivers } from './types/driver.types';

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

const mockDriverDetail: DriverDetail = {
  id: 'driver-1',
  name: 'Driver One',
  email: 'driver@test.com',
  phone: '+1234567890',
  avatarUrl: null,
  isActive: true,
  availability: Availability.AVAILABLE,
  vehicleType: VehicleType.CAR,
  vehiclePlate: 'ABC-123',
  rating: 4.8,
  totalDeliveries: 42,
  completedToday: 3,
  successRate: 95.5,
  currentLat: null,
  currentLng: null,
  locationUpdatedAt: null,
  maxConcurrentOrders: 5,
  memberSince: new Date('2025-01-01'),
  activeOrders: 2,
};

const mockPaginatedDrivers: PaginatedDrivers = {
  data: [mockDriverDetail],
  meta: { total: 1, page: 1, limit: 10 },
};

describe('DriversController', () => {
  let controller: DriversController;
  let service: {
    findAll: jest.Mock;
    findOne: jest.Mock;
    updateAvailability: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateAvailability: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [{ provide: DriversService, useValue: service }],
    }).compile();

    controller = module.get<DriversController>(DriversController);
  });

  // list drivers
  describe('findAll', () => {
    it('delegates to driversService.findAll with query and returns the result', async () => {
      const query = { page: 1, limit: 10 };
      service.findAll.mockResolvedValue(mockPaginatedDrivers);
      const result = await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedDrivers);
    });
  });

  // driver detail
  describe('findOne', () => {
    it('delegates to driversService.findOne with id and user', async () => {
      service.findOne.mockResolvedValue(mockDriverDetail);
      const result = await controller.findOne('driver-1', adminUser);
      expect(service.findOne).toHaveBeenCalledWith('driver-1', adminUser);
      expect(result).toEqual(mockDriverDetail);
    });
  });

  // update availability
  describe('updateAvailability', () => {
    it('delegates to driversService.updateAvailability with id, dto, and user', async () => {
      const dto = { availability: Availability.BUSY };
      service.updateAvailability.mockResolvedValue({
        ...mockDriverDetail,
        availability: Availability.BUSY,
      });
      const result = await controller.updateAvailability(
        'driver-1',
        dto,
        driverUser,
      );
      expect(service.updateAvailability).toHaveBeenCalledWith(
        'driver-1',
        dto,
        driverUser,
      );
      expect(result).toMatchObject({ availability: Availability.BUSY });
    });
  });
});
