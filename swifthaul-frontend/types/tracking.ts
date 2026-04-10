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
