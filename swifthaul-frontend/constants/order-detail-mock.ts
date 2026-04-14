// ─────────────────────────────────────────────────────────────────────────────
// order-detail-mock.ts — Mock data for the order detail page.
// Replace getOrderDetail with a TanStack Query hook once the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

import { MOCK_ORDERS } from '@/constants/orders-mock';
import { ORDER_DETAIL } from '@/constants/order-detail';
import type { Driver, OrderDetail, TimelineEvent } from '@/types/order-detail';
import type { OrderStatus } from '@/types/order';

// ── Available drivers ─────────────────────────────────────────────────────────

export const MOCK_DRIVERS: Driver[] = [
  { id: 'DRV-001', name: 'Marcus Chen',     avatarUrl: null, vehicleType: 'CAR',   vehiclePlate: 'WA-4821-X' },
  { id: 'DRV-002', name: 'Elena Rodriguez', avatarUrl: null, vehicleType: 'VAN',   vehiclePlate: 'WA-7234-B' },
  { id: 'DRV-003', name: 'James Wilson',    avatarUrl: null, vehicleType: 'TRUCK', vehiclePlate: 'WA-9012-C' },
  { id: 'DRV-004', name: 'Priya Sharma',    avatarUrl: null, vehicleType: 'CAR',   vehiclePlate: 'WA-3456-D' },
  { id: 'DRV-005', name: 'Tom Nguyen',      avatarUrl: null, vehicleType: 'BIKE',  vehiclePlate: 'WA-5678-E' },
  { id: 'DRV-006', name: 'Aisha Okonkwo',   avatarUrl: null, vehicleType: 'CAR',   vehiclePlate: 'WA-2345-F' },
  { id: 'DRV-007', name: 'Carlos Mendez',   avatarUrl: null, vehicleType: 'VAN',   vehiclePlate: 'WA-6789-G' },
];

// ── Timeline builder ──────────────────────────────────────────────────────────

/** Ordered progression for a successful delivery */
const MAIN_FLOW: OrderStatus[] = [
  'PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED',
];

/** Terminal statuses that end the main flow early */
const TERMINAL: Set<OrderStatus> = new Set(['FAILED', 'CANCELLED', 'RESCHEDULED']);

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function buildTimeline(status: OrderStatus, date: string, baseTime: string): TimelineEvent[] {
  const currentIdx = MAIN_FLOW.indexOf(status);
  const isTerminal  = TERMINAL.has(status);

  // Which steps from MAIN_FLOW are completed/current/upcoming
  const completedCount = isTerminal
    ? Math.min(2, MAIN_FLOW.length)  // PENDING + ASSIGNED completed before terminal
    : currentIdx;

  const steps: TimelineEvent[] = MAIN_FLOW.map((s, i) => {
    const isCompleted = i < completedCount;
    const isCurrent   = !isTerminal && i === currentIdx;
    const timestamp   = isCompleted || isCurrent
      ? `${date} at ${addMinutes(baseTime, -(completedCount - i) * 18)}`
      : null;

    return {
      status: s,
      label: ORDER_DETAIL.TIMELINE_LABELS[s],
      timestamp,
      isCompleted,
      isCurrent,
    };
  });

  // Append the terminal step at the end if applicable
  if (isTerminal) {
    steps.push({
      status,
      label: ORDER_DETAIL.TIMELINE_LABELS[status],
      timestamp: `${date} at ${baseTime}`,
      isCompleted: false,
      isCurrent: true,
      note: status === 'FAILED' ? 'Recipient not available at delivery address.' : undefined,
    });
  }

  return steps;
}

// ── Driver lookup ─────────────────────────────────────────────────────────────

function findDriver(name: string | null): Driver | null {
  if (!name) return null;
  return MOCK_DRIVERS.find((d) => d.name === name) ?? {
    id: 'DRV-000',
    name,
    avatarUrl: null,
    vehicleType: null,
    vehiclePlate: null,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getOrderDetail(id: string): OrderDetail | null {
  const order = MOCK_ORDERS.find((o) => o.referenceId === id);
  if (!order) return null;

  const driver = findDriver(order.driver);

  return {
    referenceId:       order.referenceId,
    status:            order.status,
    priority:          order.priority,
    createdAt:         `${order.date} at ${order.time}`,
    estimatedDelivery: `${order.date} by 18:00`,

    senderName:  'Mock Sender',
    senderPhone: '+1 (206) 555-0000',

    recipientName:  order.recipient,
    recipientPhone: '+1 (206) 555-0100',
    recipientEmail: `${order.recipient.split(' ')[0].toLowerCase()}@example.com`,

    pickupAddress:   '1420 5th Ave, Seattle, WA 98101',
    deliveryAddress: order.destination,

    weightKg:           2.4,
    dimensions:         '30 × 20 × 15 cm',
    packageDescription: 'Standard parcel — fragile contents',
    notes: order.priority === 'SAME_DAY' ? 'Handle with care. Signature required.' : undefined,
    trackingToken: `mock-token-${order.referenceId}`,

    driver,
    timeline: buildTimeline(order.status, order.date, order.time),

    pod: order.status === 'DELIVERED'
      ? { signedBy: order.recipient, photoUrl: '/mock-pod-photo.jpg', uploadedAt: `${order.date} at ${order.time}` }
      : order.status === 'FAILED'
      ? { failReason: 'NOT_HOME' as const, failureNotes: 'Delivery attempted — no one present.', uploadedAt: `${order.date} at ${order.time}` }
      : undefined,
  };
}
