export type OrderStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RESCHEDULED'
  | 'CANCELLED';

export type Priority = 'STANDARD' | 'EXPRESS' | 'SAME_DAY';

/** Used in the dashboard recent-orders widget */
export interface RecentOrder {
  referenceId: string;
  status: OrderStatus;
  recipient: string;
  destination: string;
  driver: string | null;
  priority: Priority;
  time: string;
}

/** Full order record used in the orders list page */
export interface Order {
  referenceId: string;
  status: OrderStatus;
  recipient: string;
  destination: string;
  driver: string | null;
  priority: Priority;
  date: string;
  time: string;
}

export type OrderFilterStatus = 'ALL' | OrderStatus;
export type PriorityFilter = 'ALL' | Priority;

// ── Hook Types ───────────────────────────────────────────────────────────────

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  statuses?: string;
  search?: string;
  driverId?: string;
  dateFrom?: string;
  dateTo?: string;
  dateField?: 'createdAt' | 'updatedAt';
}

export interface UpdateOrderPayload {
  senderName?: string;
  senderPhone?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  packageDescription?: string;
  weightKg?: number;
  dimensions?: string;
  priority?: Priority;
  notes?: string;
  scheduledPickupTime?: string;
  estimatedDelivery?: string;
}

export interface AssignDriverPayload {
  referenceId: string;
  driverId: string;
  note?: string;
}

// ── API Response Types ───────────────────────────────────────────────────────

export interface ApiOrderDriver {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ApiOrderListItem {
  referenceId: string;
  status: OrderStatus;
  priority: Priority;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  driver: ApiOrderDriver | null;
  dispatcher: { id: string; name: string };
  estimatedDelivery: string | null;
  pod?: {
    failReason: string | null;
    failureNotes: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrderListResponse {
  data: ApiOrderListItem[];
  meta: { total: number; page: number; limit: number };
}
