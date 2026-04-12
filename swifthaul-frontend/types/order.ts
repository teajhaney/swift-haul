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
