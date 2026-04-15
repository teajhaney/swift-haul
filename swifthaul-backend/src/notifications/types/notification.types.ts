import type { NotificationType, NotifChannel } from '@prisma/client';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  channel: NotifChannel;
  title: string;
  body: string;
  isRead: boolean;
  orderId: string | null;
  createdAt: Date;
}

export interface PaginatedNotifications {
  data: NotificationItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  };
}
