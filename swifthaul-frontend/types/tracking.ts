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
  pickupAddress: string;
  pickupLat: number | null;
  pickupLng: number | null;
  deliveryLat: number | null;
  deliveryLng: number | null;
  estimatedDelivery: string | null;
  driver: {
    name: string;
    vehicleType: string | null;
    currentLat: number | null;
    currentLng: number | null;
    locationUpdatedAt: string | null;
  } | null;
  statusLogs: ApiTrackingStatusLog[];
}

export interface TrackingLocationEvent {
  referenceId: string;
  trackingToken: string;
  driverId: string;
  lat: number;
  lng: number;
  speed: number | null;
  heading: number | null;
  locationUpdatedAt: string;
}
