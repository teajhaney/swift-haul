export type NotificationType =
  | 'ORDER_ASSIGNED'
  | 'STATUS_CHANGED'
  | 'DELIVERY_COMPLETED'
  | 'DELIVERY_FAILED'
  | 'DRIVER_ONLINE'
  | 'DRIVER_OFFLINE'
  | 'SYSTEM_MAINTENANCE'
  | 'SYSTEM_UPDATE'
  | 'SHIPMENT_UPDATE'
  | 'ROUTE_UPDATED';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  /** Plain-text body — order/driver refs are embedded as plain text here */
  message: string;
  /** Primary order ID reference (rendered as a link) */
  orderRef?: string;
  /** Bold driver/recipient name inside the message */
  boldRef?: string;
  /** Part of message shown in error color (e.g. failure reason) */
  errorRef?: string;
  isRead: boolean;
  timestamp: string;
}

// ── API response types ────────────────────────────────────────────────────────

export interface ApiNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  orderId: string | null;
  orderReferenceId: string | null;
  createdAt: string;
}

export interface ApiNotificationListResponse {
  data: ApiNotification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
  };
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
}
