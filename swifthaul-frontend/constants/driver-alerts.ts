import { Package, RefreshCw, Calendar, Settings, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DriverAlertType } from '@/types/driver-pages';

export const ALERTS_PAGE_SIZE = 5;

/** Maps each alert type to the Lucide icon component to display */
export const ALERT_TYPE_ICONS: Record<DriverAlertType, LucideIcon> = {
  ORDER_ASSIGNED:  Package,
  ORDER_UPDATED:   RefreshCw,
  SCHEDULE_CHANGE: Calendar,
  SYSTEM:          Settings,
  URGENT:          AlertTriangle,
};
