import { Injectable } from '@nestjs/common';
import { OrderStatus, Availability } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { DashboardStats } from './types/analytics.types';

const ACTIVE_STATUSES: OrderStatus[] = [
  OrderStatus.ASSIGNED,
  OrderStatus.ACCEPTED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.OUT_FOR_DELIVERY,
];

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // get dashboard stats
  async getStats(): Promise<DashboardStats> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalOrders,
      pendingOrders,
      activeOrders,
      deliveredToday,
      activeDrivers,
      deliveredTotal,
      failedTotal,
      cancelledTotal,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: { in: ACTIVE_STATUSES } } }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.DELIVERED,
          updatedAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      this.prisma.driverProfile.count({
        where: { availability: { not: Availability.OFFLINE } },
      }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.count({ where: { status: OrderStatus.FAILED } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    const resolvedOrders = deliveredTotal + failedTotal + cancelledTotal;
    const successRate =
      resolvedOrders > 0
        ? Math.round((deliveredTotal / resolvedOrders) * 100 * 10) / 10
        : 0;

    return {
      totalOrders,
      pendingOrders,
      activeOrders,
      deliveredToday,
      activeDrivers,
      successRate,
    };
  }
}
