import { OrderStatus, Priority, Prisma, VehicleType } from '@prisma/client';

export interface OrderDriverInfo {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface OrderDriverDetailInfo extends OrderDriverInfo {
  vehicleType: VehicleType | null;
  vehiclePlate: string | null;
}

export interface OrderDispatcherInfo {
  id: string;
  name: string;
}

export interface OrderPodInfo {
  failReason: string | null;
  failureNotes: string | null;
}

export interface StatusLogEntry {
  id: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy: { id: string; name: string };
  note: string | null;
  createdAt: Date;
}

export interface OrderListItem {
  referenceId: string;
  status: OrderStatus;
  priority: Priority;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  driver: OrderDriverInfo | null;
  dispatcher: OrderDispatcherInfo;
  estimatedDelivery: Date | null;
  pod?: OrderPodInfo | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDetail extends OrderListItem {
  trackingToken: string;
  recipientEmail: string | null;
  pickupAddress: string;
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  packageDescription: string;
  weightKg: number | null;
  dimensions: string | null;
  notes: string | null;
  scheduledPickupTime: Date | null;
  failedAttempts: number;
  maxRetries: number;
  driver: OrderDriverDetailInfo | null;
  statusLogs: StatusLogEntry[];
}

export interface PaginatedOrders {
  data: OrderListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PublicTrackingResponse {
  referenceId: string;
  status: OrderStatus;
  recipientName: string;
  deliveryAddress: string;
  estimatedDelivery: Date | null;
  driver: {
    name: string;
    vehicleType: VehicleType | null;
  } | null;
  statusLogs: Array<{
    fromStatus: OrderStatus;
    toStatus: OrderStatus;
    createdAt: Date;
  }>;
}

export type UploadedPodFile = { buffer: Buffer } | undefined;

// Prisma payload types used by the private mappers
export type OrderListResult = Prisma.OrderGetPayload<{
  include: {
    driver: { select: { id: true; name: true; avatarUrl: true } };
    dispatcher: { select: { id: true; name: true } };
    pod: { select: { failReason: true; failureNotes: true } };
  };
}>;

export type OrderDetailResult = Prisma.OrderGetPayload<{
  include: {
    driver: {
      select: {
        id: true;
        name: true;
        avatarUrl: true;
        driverProfile: { select: { vehicleType: true; vehiclePlate: true } };
      };
    };
    dispatcher: { select: { id: true; name: true } };
    statusLogs: {
      orderBy: { createdAt: 'asc' };
      include: { changedBy: { select: { id: true; name: true } } };
    };
  };
}>;

export type OrderTrackingResult = Prisma.OrderGetPayload<{
  include: {
    driver: {
      select: {
        name: true;
        driverProfile: { select: { vehicleType: true } };
      };
    };
    statusLogs: { orderBy: { createdAt: 'asc' } };
  };
}>;
