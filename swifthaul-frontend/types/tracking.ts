export type TrackingOrder = {
  trackingId: string;
  status: string;
  recipientName: string;
  deliveryAddress: string;
  packageDescription: string;
  driverName: string;
  driverInitials: string;
  driverPhone: string;
  estimatedArrival: string;
  distanceAway: string;
  lastUpdated: string;
};

export type TrackingTimelineEvent = {
  label: string;
  time: string;
  note: string;
  isCurrent: boolean;
  isCompleted: boolean;
};

// API response from GET /orders/track/:token (public, no auth)
export interface ApiTrackingStatusLog {
  fromStatus: string;
  toStatus: string;
  createdAt: string; // ISO string after JSON serialization
}

export interface ApiTrackingResponse {
  referenceId: string;
  status: string;
  recipientName: string;
  deliveryAddress: string;
  estimatedDelivery: string | null;
  driver: {
    name: string;
    vehicleType: string | null;
  } | null;
  statusLogs: ApiTrackingStatusLog[];
}
