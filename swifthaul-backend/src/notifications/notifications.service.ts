import { Injectable } from '@nestjs/common';
import {
  NotifChannel,
  NotificationType,
  OrderStatus,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationFormatter } from './notifications.formatter';
import { NotificationsGateway } from './notifications.gateway';
import type { ListNotificationsDto } from './dto/list-notifications.dto';
import type {
  NotificationItem,
  PaginatedNotifications,
} from './types/notification.types';
import { NotificationNotFoundException } from '../common/exceptions/domain.exceptions';

const NOTIFICATION_INCLUDE = {
  order: { select: { referenceId: true } },
} as const;

type NotificationResult = Prisma.NotificationGetPayload<{
  include: typeof NOTIFICATION_INCLUDE;
}>;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  // list notifications for current user
  async findAll(
    userId: string,
    query: ListNotificationsDto,
  ): Promise<PaginatedNotifications> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId,
      channel: 'IN_APP',
    };

    if (query.isRead !== undefined) {
      where.isRead = query.isRead;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: NOTIFICATION_INCLUDE,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, channel: 'IN_APP', isRead: false },
      }),
    ]);

    return {
      data: notifications.map((n) => this.toNotificationItem(n)),
      meta: { total, page, limit, unreadCount },
    };
  }

  // mark one notification as read
  async markRead(id: string, userId: string): Promise<NotificationItem> {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) throw new NotificationNotFoundException();

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
      include: NOTIFICATION_INCLUDE,
    });

    return this.toNotificationItem(updated);
  }

  // mark all notifications as read
  async markAllRead(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, channel: 'IN_APP', isRead: false },
      data: { isRead: true },
    });

    return { count: result.count };
  }

  /**
   * Core method to create a notification.
   * Handles storage in DB and future hooks for Push/Email/WebSockets.
   */
  async create(data: {
    userId: string | null;
    type: NotificationType;
    channel?: NotifChannel;
    title: string;
    body: string;
    orderId?: string;
  }): Promise<void> {
    const created = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        channel: data.channel ?? 'IN_APP',
        title: data.title,
        body: data.body,
        orderId: data.orderId,
      },
      include: { order: { select: { referenceId: true } } },
    });

    // Phase 3 — emit real-time event via Socket.io
    if (created.userId && created.channel === 'IN_APP') {
      this.gateway.notifyUser(created.userId, this.toNotificationItem(created));
    }
  }

  /**
   * Notify a driver that a new order has been assigned to them.
   */
  async notifyOrderAssigned(
    userId: string,
    orderId: string,
    referenceId: string,
  ) {
    const content = NotificationFormatter.orderAssigned(referenceId);
    await this.create({
      userId,
      ...content,
      orderId,
    });
  }

  /**
   * Notify dispatchers and admins about a status change.
   */
  async notifyStatusChanged(
    orderId: string,
    referenceId: string,
    status: OrderStatus,
    actingUserName?: string,
    actingUserId?: string,
  ) {
    const content = NotificationFormatter.statusChanged(
      referenceId,
      status,
      actingUserName,
    );

    // Find all Admins and Dispatchers to notify
    const staff = await this.prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'DISPATCHER'] },
        isActive: true,
      },
      select: { id: true },
    });

    // Also notify the assigned driver if they exist and are not the one who performed the action
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { driverId: true },
    });

    const recipients = staff.map((s) => s.id);
    if (order?.driverId && order.driverId !== actingUserId) {
      recipients.push(order.driverId);
    }

    // Create notifications in parallel
    await Promise.all(
      recipients.map((targetUserId) =>
        this.create({
          userId: targetUserId,
          ...content,
          orderId,
        }),
      ),
    );
  }

  // map prisma notification to response type
  private toNotificationItem(n: NotificationResult): NotificationItem {
    return {
      id: n.id,
      type: n.type,
      channel: n.channel,
      title: n.title,
      body: n.body,
      isRead: n.isRead,
      orderId: n.orderId,
      orderReferenceId: n.order?.referenceId ?? null,
      createdAt: n.createdAt,
    };
  }
}
