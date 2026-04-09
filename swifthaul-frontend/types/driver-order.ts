export type DriverOrderStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED';

export interface ActiveDelivery {
  orderId: string;
  status: DriverOrderStatus;
  priority: string;
  recipientName: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  estimatedDelivery: string;
  distanceMiles: number;
  recipientPhone: string;
}

export interface QueueOrder {
  orderId: string;
  recipientName: string;
  address: string;
  timeWindow: string;
  weight: string;
  distanceMi: string;
}

export interface DeliveryTimelineEvent {
  label: string;
  time: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface DriverDeliveryDetail {
  orderId: string;
  status: DriverOrderStatus;
  priority: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  deliveryNotes?: string;
  pickupName: string;
  pickupAddress: string;
  pickupPhone: string;
  packageDescription: string;
  estimatedDelivery: string;
  createdAt: string;
  timeline: DeliveryTimelineEvent[];
}
