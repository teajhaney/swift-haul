import type { Availability, VehicleType } from '@prisma/client';

export interface DriverListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  availability: Availability;
  vehicleType: VehicleType;
  vehiclePlate: string;
  rating: number;
  totalDeliveries: number;
  completedToday: number;
  successRate: number;
}

export interface DriverDetail extends DriverListItem {
  currentLat: number | null;
  currentLng: number | null;
  locationUpdatedAt: Date | null;
  maxConcurrentOrders: number;
  memberSince: Date;
  activeOrders: number;
}

export interface PaginatedDrivers {
  data: DriverListItem[];
  meta: { total: number; page: number; limit: number };
}
