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

export interface RecentOrder {
  id: string;
  status: OrderStatus;
  recipient: string;
  destination: string;
  driver: string | null;
  priority: Priority;
  time: string;
}
