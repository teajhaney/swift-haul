import type { LucideIcon } from 'lucide-react';

export type TimeRange = '7d' | '30d' | '90d' | 'custom';

export interface KpiData {
  id: string;
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface DeliveryChartPoint {
  day: string;
  orders: number;
  lastWeek: number;
}

export interface StatusSlice {
  name: string;
  value: number;
  color: string;
}
