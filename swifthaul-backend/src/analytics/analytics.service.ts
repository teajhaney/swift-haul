import { Injectable } from '@nestjs/common';
import { OrderStatus, Availability } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type {
  DashboardStats,
  ChartPoint,
  ChartResponse,
  StatusBreakdownResponse,
} from './types/analytics.types';

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

  // get delivery chart data for the selected time range vs the previous period
  async getChartData(
    range: '7d' | '30d' | '90d' = '7d',
    startDate?: string,
    endDate?: string,
  ): Promise<ChartResponse> {
    // custom date range takes priority over preset range
    if (startDate && endDate) {
      return this.getCustomRangeChartData(startDate, endDate);
    }

    const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
    const useWeekly = days === 90;
    const useDayNames = days === 7;

    const now = new Date();

    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - (days - 1));
    currentStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - days);

    const previousEnd = new Date(currentStart);
    previousEnd.setMilliseconds(-1);

    const [currentOrders, previousOrders] = await Promise.all([
      this.prisma.order.findMany({
        where: { createdAt: { gte: currentStart, lte: todayEnd } },
        select: { createdAt: true },
      }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: previousStart, lte: previousEnd } },
        select: { createdAt: true },
      }),
    ]);

    const points = useWeekly
      ? this.buildWeeklyPoints(
          currentOrders,
          previousOrders,
          currentStart,
          days,
        )
      : this.buildDailyPoints(
          currentOrders,
          previousOrders,
          currentStart,
          previousStart,
          days,
          useDayNames,
        );

    return { points };
  }

  // build chart data for a custom date range vs the equivalent prior period
  private async getCustomRangeChartData(
    startDate: string,
    endDate: string,
  ): Promise<ChartResponse> {
    const currentStart = new Date(`${startDate}T00:00:00.000Z`);
    const currentEnd = new Date(`${endDate}T23:59:59.999Z`);

    const msPerDay = 24 * 60 * 60 * 1000;
    const days =
      Math.round((currentEnd.getTime() - currentStart.getTime()) / msPerDay) +
      1;

    const previousEnd = new Date(currentStart);
    previousEnd.setMilliseconds(-1);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - (days - 1));
    previousStart.setHours(0, 0, 0, 0);

    const useWeekly = days > 30;
    const useDayNames = false;

    const [currentOrders, previousOrders] = await Promise.all([
      this.prisma.order.findMany({
        where: { createdAt: { gte: currentStart, lte: currentEnd } },
        select: { createdAt: true },
      }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: previousStart, lte: previousEnd } },
        select: { createdAt: true },
      }),
    ]);

    const points = useWeekly
      ? this.buildWeeklyPoints(
          currentOrders,
          previousOrders,
          currentStart,
          days,
        )
      : this.buildDailyPoints(
          currentOrders,
          previousOrders,
          currentStart,
          previousStart,
          days,
          useDayNames,
        );

    return { points };
  }

  // get order status breakdown for the donut chart
  async getStatusBreakdown(): Promise<StatusBreakdownResponse> {
    const [delivered, inTransit, pending, exceptions] = await Promise.all([
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.count({
        where: {
          status: {
            in: [OrderStatus.IN_TRANSIT, OrderStatus.OUT_FOR_DELIVERY],
          },
        },
      }),
      this.prisma.order.count({
        where: {
          status: {
            in: [
              OrderStatus.PENDING,
              OrderStatus.ASSIGNED,
              OrderStatus.ACCEPTED,
              OrderStatus.PICKED_UP,
              OrderStatus.RESCHEDULED,
            ],
          },
        },
      }),
      this.prisma.order.count({
        where: { status: { in: [OrderStatus.FAILED, OrderStatus.CANCELLED] } },
      }),
    ]);

    const total = delivered + inTransit + pending + exceptions;
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

    return {
      slices: [
        { name: 'Delivered', value: pct(delivered), color: '#10B981' },
        { name: 'In Transit', value: pct(inTransit), color: '#06B6D4' },
        { name: 'Pending', value: pct(pending), color: '#94A3B8' },
        { name: 'Exceptions', value: pct(exceptions), color: '#EF4444' },
      ],
      total,
    };
  }

  private buildDailyPoints(
    currentOrders: { createdAt: Date }[],
    previousOrders: { createdAt: Date }[],
    currentStart: Date,
    previousStart: Date,
    days: number,
    useDayNames: boolean,
  ): ChartPoint[] {
    const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return Array.from({ length: days }, (_, i) => {
      const curDay = new Date(currentStart);
      curDay.setDate(curDay.getDate() + i);
      const curDayEnd = new Date(curDay);
      curDayEnd.setDate(curDayEnd.getDate() + 1);

      const prevDay = new Date(previousStart);
      prevDay.setDate(prevDay.getDate() + i);
      const prevDayEnd = new Date(prevDay);
      prevDayEnd.setDate(prevDayEnd.getDate() + 1);

      const orders = currentOrders.filter(
        (o) => o.createdAt >= curDay && o.createdAt < curDayEnd,
      ).length;

      const lastWeek = previousOrders.filter(
        (o) => o.createdAt >= prevDay && o.createdAt < prevDayEnd,
      ).length;

      const day = useDayNames
        ? DAY_ABBR[curDay.getDay()]
        : curDay.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

      return { day, orders, lastWeek };
    });
  }

  private buildWeeklyPoints(
    currentOrders: { createdAt: Date }[],
    previousOrders: { createdAt: Date }[],
    currentStart: Date,
    days: number,
  ): ChartPoint[] {
    const weeks = Math.ceil(days / 7);

    return Array.from({ length: weeks }, (_, i) => {
      const weekStart = new Date(currentStart);
      weekStart.setDate(weekStart.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const prevWeekStart = new Date(weekStart);
      prevWeekStart.setDate(prevWeekStart.getDate() - days);
      const prevWeekEnd = new Date(prevWeekStart);
      prevWeekEnd.setDate(prevWeekEnd.getDate() + 7);

      const orders = currentOrders.filter(
        (o) => o.createdAt >= weekStart && o.createdAt < weekEnd,
      ).length;

      const lastWeek = previousOrders.filter(
        (o) => o.createdAt >= prevWeekStart && o.createdAt < prevWeekEnd,
      ).length;

      const day = weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      return { day, orders, lastWeek };
    });
  }
}
