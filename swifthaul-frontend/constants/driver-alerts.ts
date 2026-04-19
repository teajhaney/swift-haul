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

export const ALERT_TYPE_STYLES: Record<NotificationType, { bg: string; text: string; dot: string; label: string }> = {
  ORDER_ASSIGNED:     { bg: 'bg-info/10',          text: 'text-info',        dot: 'bg-info',        label: 'Assigned' },
  STATUS_CHANGED:     { bg: 'bg-warning/10',       text: 'text-warning',     dot: 'bg-warning',     label: 'Updated'  },
  DELIVERY_COMPLETED: { bg: 'bg-success/10',       text: 'text-success',     dot: 'bg-success',     label: 'Delivered' },
  DELIVERY_FAILED:    { bg: 'bg-error/10',         text: 'text-error',       dot: 'bg-error',       label: 'Failed'   },
  DRIVER_ONLINE:      { bg: 'bg-success/10',       text: 'text-success',     dot: 'bg-success',     label: 'Online'   },
  DRIVER_OFFLINE:     { bg: 'bg-surface-elevated', text: 'text-text-muted',  dot: 'bg-text-muted',  label: 'Offline'  },
  SYSTEM_MAINTENANCE: { bg: 'bg-purple-50',        text: 'text-purple-600',  dot: 'bg-purple-500',  label: 'System'   },
  SYSTEM_UPDATE:      { bg: 'bg-surface-elevated', text: 'text-text-muted',  dot: 'bg-text-muted',  label: 'System'   },
  SHIPMENT_UPDATE:    { bg: 'bg-primary-subtle',   text: 'text-primary-light', dot: 'bg-primary-light', label: 'Shipment' },
  ROUTE_UPDATED:      { bg: 'bg-info/10',          text: 'text-info',        dot: 'bg-info',        label: 'Route'    },
};
