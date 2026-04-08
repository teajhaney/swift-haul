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

export type Priority = 'HIGH' | 'NORMAL' | 'LOW';

/** Used in the dashboard recent-orders widget */
export interface RecentOrder {
  id: string;
  status: OrderStatus;
  recipient: string;
  destination: string;
  driver: string | null;
  priority: Priority;
  time: string;
}

/** Full order record used in the orders list page */
export interface Order {
  id: string;
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
