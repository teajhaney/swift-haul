import {
  Package,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Wrench,
  Settings,
  Truck,
  MapPin,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NotificationType } from '@/types/notification';

export const ALERTS_PAGE_SIZE = 5;

/** Maps each alert type to the Lucide icon component to display */
export const ALERT_TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  ORDER_ASSIGNED:     Package,
  STATUS_CHANGED:     RefreshCw,
  DELIVERY_COMPLETED: CheckCircle2,
  DELIVERY_FAILED:    AlertTriangle,
  DRIVER_ONLINE:      UserCheck,
  DRIVER_OFFLINE:     UserX,
  SYSTEM_MAINTENANCE: Wrench,
  SYSTEM_UPDATE:      Settings,
  SHIPMENT_UPDATE:    Truck,
  ROUTE_UPDATED:      MapPin,
};
