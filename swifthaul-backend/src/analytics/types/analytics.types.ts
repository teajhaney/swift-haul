export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  deliveredToday: number;
  activeDrivers: number;
  successRate: number;
}

export interface ChartPoint {
  day: string;
  orders: number;
  lastWeek: number;
}

export interface ChartResponse {
  points: ChartPoint[];
}

export interface StatusSlice {
  name: string;
  value: number; // percentage 0-100
  color: string; // hex
}

export interface StatusBreakdownResponse {
  slices: StatusSlice[];
  total: number;
}
