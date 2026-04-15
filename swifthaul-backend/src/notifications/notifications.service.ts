import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
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
  constructor(private readonly prisma: PrismaService) {}

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
