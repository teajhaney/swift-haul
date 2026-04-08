import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Info,
  Settings,
  Truck,
  Map,
} from 'lucide-react';
import type { NotificationType } from '@/types/notification';

interface NotificationIconProps {
  type: NotificationType;
  size?: 'sm' | 'md';
}

const CONFIG: Record<
  NotificationType,
  { Icon: React.ElementType; bg: string; color: string }
> = {
  ORDER_ASSIGNED:     { Icon: ClipboardList,  bg: 'bg-primary-subtle',  color: 'text-primary-light' },
  DELIVERY_COMPLETED: { Icon: CheckCircle2,   bg: 'bg-success/10',      color: 'text-success' },
  DELIVERY_FAILED:    { Icon: AlertTriangle,  bg: 'bg-error/10',        color: 'text-error' },
  DRIVER_ONLINE:      { Icon: UserPlus,       bg: 'bg-primary-subtle',  color: 'text-primary-light' },
  SYSTEM_MAINTENANCE: { Icon: Info,           bg: 'bg-primary-subtle',  color: 'text-primary-light' },
  SYSTEM_UPDATE:      { Icon: Settings,       bg: 'bg-surface-elevated', color: 'text-text-muted' },
  SHIPMENT_UPDATE:    { Icon: Truck,          bg: 'bg-accent-soft',     color: 'text-accent' },
  ROUTE_UPDATED:      { Icon: Map,            bg: 'bg-surface-elevated', color: 'text-text-muted' },
};

export function NotificationIcon({ type, size = 'md' }: NotificationIconProps) {
  const { Icon, bg, color } = CONFIG[type];
  const wrapSize = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className={`${wrapSize} rounded-full ${bg} flex items-center justify-center shrink-0`}>
      <Icon className={`${iconSize} ${color}`} />
    </div>
  );
}
