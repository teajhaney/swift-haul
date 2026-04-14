import type { OrderStatus, Priority } from './order';

export interface TimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string | null;   // null = upcoming (not yet reached)
  location?: string;
  note?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

// Driver shape returned by the order detail endpoint
export interface Driver {
  id: string;
  name: string;
  avatarUrl: string | null;
  vehicleType: string | null;
  vehiclePlate: string | null;
}

// API response types for the order detail endpoint
export interface ApiStatusLog {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: { id: string; name: string };
  note: string | null;
  createdAt: string;
}

export interface ApiOrderDetail {
  referenceId: string;
  status: OrderStatus;
  priority: Priority;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string | null;
  deliveryAddress: string;
  pickupAddress: string;
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  packageDescription: string;
  weightKg: number | null;
  dimensions: string | null;
  notes: string | null;
  scheduledPickupTime: string | null;
  estimatedDelivery: string | null;
  failedAttempts: number;
  maxRetries: number;
  trackingToken: string;
  driver: Driver | null;
  dispatcher: { id: string; name: string };
  statusLogs: ApiStatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface ProofOfDelivery {
  // Successful delivery
  photoUrl?: string;
  signatureUrl?: string;
  signedBy?: string;
  // Failed delivery
  failReason?: 'NOT_HOME' | 'WRONG_ADDRESS' | 'REFUSED' | 'OTHER';
  failureNotes?: string;
  // Shared
  notes?: string;
  uploadedAt: string;
}

export interface OrderDetail {
  referenceId: string;
  status: OrderStatus;
  priority: Priority;
  createdAt: string;
  estimatedDelivery: string | null;

  // Sender
  senderName: string;
  senderPhone: string;

  // Recipient
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string | null;

  // Addresses
  pickupAddress: string;
  deliveryAddress: string;

  // Package
  weightKg: number | null;
  dimensions: string | null;
  packageDescription: string;
  notes?: string | null;

  // Tracking
  trackingToken: string;

  // Assignment
  driver: Driver | null;

  // History
  timeline: TimelineEvent[];

  // Proof of delivery (DELIVERED or FAILED only)
  pod?: ProofOfDelivery;
}
