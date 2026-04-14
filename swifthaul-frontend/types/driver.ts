export type DriverAvailability = 'AVAILABLE' | 'BUSY' | 'OFFLINE';
export type VehicleType = 'BIKE' | 'CAR' | 'VAN' | 'TRUCK';

// API response types — match the NestJS backend exactly
export interface ApiDriverListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  availability: DriverAvailability;
  vehicleType: VehicleType;
  vehiclePlate: string;
  rating: number;
  totalDeliveries: number;
  completedToday: number;
  successRate: number;
}

export interface ApiDriverDetail extends ApiDriverListItem {
  currentLat: number | null;
  currentLng: number | null;
  locationUpdatedAt: string | null;
  maxConcurrentOrders: number;
  memberSince: string;
  activeOrders: number;
}

export interface ApiDriverListResponse {
  data: ApiDriverListItem[];
  meta: { total: number; page: number; limit: number };
}

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
  referenceId: string;
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
  referenceId: string;
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
