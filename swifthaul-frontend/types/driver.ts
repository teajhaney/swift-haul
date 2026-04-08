export type DriverAvailability = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  vehiclePlate: string;
  availability: DriverAvailability;
  currentLoad: number;
  maxLoad: number;
  completedToday: number;
  avgDeliveryTime: string;
  avatarInitials: string;
  rating: number;
  totalDeliveries: number;
}

export interface DriverAssignment {
  orderId: string;
  status: string;
  statusColor: 'blue' | 'amber' | 'green' | 'purple';
  recipientName: string;
  address: string;
  eta: string;
}

export interface DriverActivity {
  time: string;
  title: string;
  subtitle: string;
  dotColor: 'green' | 'blue' | 'amber' | 'gray';
}

export interface DriverDeliveryRow {
  orderId: string;
  status: 'DELIVERED' | 'FAILED';
  recipientName: string;
  recipientAddress: string;
  completedAt: string;
}

export interface DriverDetail extends Driver {
  memberSince: string;
  successRate: number;
  failedDeliveries: number;
  failedReason: string;
  monthlyChange: string;
  assignments: DriverAssignment[];
  activity: DriverActivity[];
  deliveryHistory: DriverDeliveryRow[];
  totalHistoryCount: number;
}

export type DriverAvailabilityFilter = 'ALL' | DriverAvailability;
