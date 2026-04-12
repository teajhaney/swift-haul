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

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  avatarInitials: string;
  isAvailable: boolean;
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
  estimatedDelivery: string;

  // Recipient
  recipient: string;
  recipientPhone: string;
  recipientEmail: string;

  // Addresses
  pickupAddress: string;
  deliveryAddress: string;

  // Package
  weightKg: string;
  dimensions: string;
  description: string;
  notes?: string;

  // Assignment
  driver: Driver | null;

  // History
  timeline: TimelineEvent[];

  // Proof of delivery (DELIVERED or FAILED only)
  pod?: ProofOfDelivery;
}
