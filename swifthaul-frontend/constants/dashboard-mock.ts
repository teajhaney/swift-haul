// ─────────────────────────────────────────────────────────────────────────────
// dashboard-mock.ts — Placeholder data for the dashboard page.
// Replace each constant with the corresponding TanStack Query hook result
// once the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Truck,
} from 'lucide-react';
import { DASHBOARD } from '@/constants/dashboard';
import type { KpiData, DeliveryChartPoint, StatusSlice } from '@/types/analytics';
import type { RecentOrder } from '@/types/order';
import { PRIORITY_STYLES } from '@/constants/orders';

export const MOCK_KPI_DATA: KpiData[] = [
  {
    id: 'deliveries',
    label: DASHBOARD.KPI_DELIVERIES_LABEL,
    value: '1,284',
    trend: '+12%',
    trendPositive: true,
    icon: ClipboardList,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 'success',
    label: DASHBOARD.KPI_SUCCESS_LABEL,
    value: '98.2%',
    trend: '-0.5%',
    trendPositive: false,
    icon: CheckCircle2,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 'time',
    label: DASHBOARD.KPI_ACTIVE_LABEL,
    value: '42 min',
    trend: '-4m',
    trendPositive: true,
    icon: Clock,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
  },
  {
    id: 'drivers',
    label: DASHBOARD.KPI_DRIVERS_LABEL,
    value: '842',
    icon: Truck,
    iconBg: 'bg-primary-subtle',
    iconColor: 'text-primary-light',
  },
];

export const MOCK_CHART_DATA: DeliveryChartPoint[] = [
  { day: 'Mon', orders: 180, lastWeek: 150 },
  { day: 'Tue', orders: 220, lastWeek: 190 },
  { day: 'Wed', orders: 195, lastWeek: 210 },
  { day: 'Thu', orders: 280, lastWeek: 230 },
  { day: 'Fri', orders: 310, lastWeek: 260 },
  { day: 'Sat', orders: 260, lastWeek: 220 },
  { day: 'Sun', orders: 320, lastWeek: 280 },
];

export const MOCK_DONUT_DATA: StatusSlice[] = [
  { name: 'Delivered',  value: 65, color: '#10B981' },
  { name: 'In Transit', value: 20, color: '#06B6D4' },
  { name: 'Pending',    value: 10, color: '#94A3B8' },
  { name: 'Exceptions', value: 5,  color: '#EF4444' },
];

export const MOCK_RECENT_ORDERS: RecentOrder[] = [
  { referenceId: 'SH-8F3X9K2', status: 'IN_TRANSIT', recipient: 'Sarah Jenkins',      destination: '482 Oakwood Ave, Portland',    driver: 'Marcus Chen',     priority: 'SAME_DAY', time: '14:22' },
  { referenceId: 'SH-409L2P5', status: 'DELIVERED',  recipient: 'TechCorp Solutions', destination: '1200 Innovation Way, Seattle', driver: 'Elena Rodriguez', priority: 'STANDARD', time: '14:15' },
  { referenceId: 'SH-1Z6Y4M8', status: 'FAILED',     recipient: 'David Miller',       destination: '93 Pine St, Tacoma',           driver: 'James Wilson',    priority: 'EXPRESS',  time: '13:58' },
  { referenceId: 'SH-9T4V2X8', status: 'PENDING',    recipient: 'Alice Green',        destination: '214 Harbor Rd, Everett',       driver: null,              priority: 'STANDARD', time: '13:45' },
];

export const MOCK_TOTAL_ORDERS = 42;

export { PRIORITY_STYLES };
