import type { OrderStatus } from '@/types/order';

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:          'bg-gray-100 text-gray-600',
  ASSIGNED:         'bg-blue-100 text-blue-700',
  ACCEPTED:         'bg-blue-100 text-blue-700',
  PICKED_UP:        'bg-amber-100 text-amber-700',
  IN_TRANSIT:       'bg-cyan-100 text-cyan-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED:        'bg-green-100 text-green-700',
  FAILED:           'bg-red-100 text-red-700',
  RESCHEDULED:      'bg-orange-100 text-orange-700',
  CANCELLED:        'bg-gray-100 text-gray-500',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING:          'Pending',
  ASSIGNED:         'Assigned',
  ACCEPTED:         'Accepted',
  PICKED_UP:        'Picked Up',
  IN_TRANSIT:       'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED:        'Delivered',
  FAILED:           'Failed',
  RESCHEDULED:      'Rescheduled',
  CANCELLED:        'Cancelled',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
