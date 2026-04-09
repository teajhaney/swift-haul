export type DriverAlertType =
  | 'ORDER_ASSIGNED'
  | 'ORDER_UPDATED'
  | 'SCHEDULE_CHANGE'
  | 'SYSTEM'
  | 'URGENT';

export type DriverAlert = {
  id: string;
  type: DriverAlertType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

export type DeliveryHistoryItem = {
  orderId: string;
  date: string;
  recipientName: string;
  address: string;
  status: 'DELIVERED' | 'FAILED';
  distanceMi: string;
  duration: string;
  earning: string;
};

export type HistoryFilterTab = 'today' | 'week' | 'month' | 'all';

export type DriverAvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type DriverProfileData = {
  name: string;
  initials: string;
  role: string;
  vehicle: string;
  vehicleType: string;
  licensePlate: string;
  phone: string;
  email: string;
  joinedDate: string;
  totalDeliveries: number;
  thisWeek: number;
  onTimeRate: number;
  rating: number;
  currentStreak: number;
  availability: DriverAvailabilityStatus;
};

export type MapStop = {
  orderId: string;
  recipientName: string;
  address: string;
  timeWindow: string;
  status: 'active' | 'next' | 'upcoming';
  pinX: string;
  pinY: string;
};
