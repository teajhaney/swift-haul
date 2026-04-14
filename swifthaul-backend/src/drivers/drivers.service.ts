import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { ListDriversDto } from './dto/list-drivers.dto';
import type { UpdateAvailabilityDto } from './dto/update-availability.dto';
import type { UpdateDriverDto } from './dto/update-driver.dto';
import type {
  DriverDetail,
  DriverListItem,
  PaginatedDrivers,
} from './types/driver.types';
import {
  DriverNotFoundException,
  ForbiddenResourceException,
} from '../common/exceptions/domain.exceptions';

const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.ASSIGNED,
  OrderStatus.ACCEPTED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.OUT_FOR_DELIVERY,
];

type DriverListResult = Prisma.UserGetPayload<{
  include: { driverProfile: true };
}>;

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  // list drivers
  async findAll(query: ListDriversDto): Promise<PaginatedDrivers> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: Role.DRIVER,
      isActive: true,
    };

    if (query.availability) {
      where.driverProfile = { is: { availability: query.availability } };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [drivers, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { driverProfile: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: drivers.map((d) => this.toDriverListItem(d)),
      meta: { total, page, limit },
    };
  }

  // driver detail
  async findOne(id: string, user: JwtPayload): Promise<DriverDetail> {
    if (user.role === Role.DRIVER && user.sub !== id) {
      throw new ForbiddenResourceException();
    }

    const driver = await this.prisma.user.findFirst({
      where: { id, role: Role.DRIVER, isActive: true },
      include: { driverProfile: true },
    });

    if (!driver?.driverProfile) throw new DriverNotFoundException();

    const activeOrders = await this.prisma.order.count({
      where: { driverId: id, status: { in: ACTIVE_ORDER_STATUSES } },
    });

    return this.toDriverDetail(driver, activeOrders);
  }

  // update availability
  async updateAvailability(
    id: string,
    dto: UpdateAvailabilityDto,
    user: JwtPayload,
  ): Promise<DriverDetail> {
    if (user.sub !== id) {
      throw new ForbiddenResourceException();
    }

    const driver = await this.prisma.user.findFirst({
      where: { id, role: Role.DRIVER, isActive: true },
      include: { driverProfile: true },
    });

    if (!driver?.driverProfile) throw new DriverNotFoundException();

    await this.prisma.driverProfile.update({
      where: { userId: id },
      data: { availability: dto.availability },
    });

    return this.findOne(id, user);
  }

  // update driver profile
  async update(
    id: string,
    dto: UpdateDriverDto,
    user: JwtPayload,
  ): Promise<DriverDetail> {
    if (user.sub !== id) {
      throw new ForbiddenResourceException();
    }

    const driver = await this.prisma.user.findFirst({
      where: { id, role: Role.DRIVER, isActive: true },
      include: { driverProfile: true },
    });

    if (!driver?.driverProfile) throw new DriverNotFoundException();

    // Update user fields
    const userUpdateData: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) userUpdateData.name = dto.name;
    if (dto.email !== undefined) userUpdateData.email = dto.email;
    if (dto.phone !== undefined) userUpdateData.phone = dto.phone;
    if (dto.avatarUrl !== undefined) userUpdateData.avatarUrl = dto.avatarUrl;

    // Update driver profile fields
    const profileUpdateData: Prisma.DriverProfileUpdateInput = {};
    if (dto.vehicleType !== undefined)
      profileUpdateData.vehicleType = dto.vehicleType;
    if (dto.vehiclePlate !== undefined)
      profileUpdateData.vehiclePlate = dto.vehiclePlate;
    if (dto.maxConcurrentOrders !== undefined)
      profileUpdateData.maxConcurrentOrders = dto.maxConcurrentOrders;

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: userUpdateData,
      }),
      this.prisma.driverProfile.update({
        where: { userId: id },
        data: profileUpdateData,
      }),
    ]);

    return this.findOne(id, user);
  }

  // delete driver (admin only)
  async remove(id: string, user: JwtPayload): Promise<void> {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenResourceException();
    }

    const driver = await this.prisma.user.findFirst({
      where: { id, role: Role.DRIVER, isActive: true },
      include: { driverProfile: true },
    });

    if (!driver?.driverProfile) throw new DriverNotFoundException();

    // Check if driver has active orders
    const activeOrders = await this.prisma.order.count({
      where: { driverId: id, status: { in: ACTIVE_ORDER_STATUSES } },
    });

    if (activeOrders > 0) {
      throw new ForbiddenResourceException();
    }

    // Soft delete by setting isActive to false
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  //driver list result mapper
  private toDriverListItem(user: DriverListResult): DriverListItem {
    const profile = user.driverProfile!;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      availability: profile.availability,
      vehicleType: profile.vehicleType,
      vehiclePlate: profile.vehiclePlate,
      rating: profile.rating.toNumber(),
      totalDeliveries: profile.totalDeliveries,
      completedToday: profile.completedToday,
      successRate: profile.successRate.toNumber(),
    };
  }

  //driver details result mapper
  private toDriverDetail(
    user: DriverListResult,
    activeOrders: number,
  ): DriverDetail {
    const profile = user.driverProfile!;
    return {
      ...this.toDriverListItem(user),
      currentLat: profile.currentLat,
      currentLng: profile.currentLng,
      locationUpdatedAt: profile.locationUpdatedAt,
      maxConcurrentOrders: profile.maxConcurrentOrders,
      memberSince: profile.memberSince,
      activeOrders,
    };
  }
}
