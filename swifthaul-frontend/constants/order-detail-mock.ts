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
  { id: 'DRV-001', name: 'Marcus Chen',     phone: '+1 (206) 555-0201', vehicle: 'Toyota Camry · WA-4821-X',   avatarInitials: 'MC', isAvailable: true  },
  { id: 'DRV-002', name: 'Elena Rodriguez', phone: '+1 (206) 555-0202', vehicle: 'Honda CR-V · WA-7234-B',     avatarInitials: 'ER', isAvailable: false },
  { id: 'DRV-003', name: 'James Wilson',    phone: '+1 (206) 555-0203', vehicle: 'Ford Transit · WA-9012-C',   avatarInitials: 'JW', isAvailable: true  },
  { id: 'DRV-004', name: 'Priya Sharma',    phone: '+1 (206) 555-0204', vehicle: 'Nissan Leaf · WA-3456-D',    avatarInitials: 'PS', isAvailable: true  },
  { id: 'DRV-005', name: 'Tom Nguyen',      phone: '+1 (206) 555-0205', vehicle: 'Chevy Spark · WA-5678-E',    avatarInitials: 'TN', isAvailable: false },
  { id: 'DRV-006', name: 'Aisha Okonkwo',   phone: '+1 (206) 555-0206', vehicle: 'Tesla Model 3 · WA-2345-F',  avatarInitials: 'AO', isAvailable: true  },
  { id: 'DRV-007', name: 'Carlos Mendez',   phone: '+1 (206) 555-0207', vehicle: 'Ram ProMaster · WA-6789-G',  avatarInitials: 'CM', isAvailable: true  },
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
    phone: '+1 (206) 555-0200',
    vehicle: 'Vehicle on file',
    avatarInitials: name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2),
    isAvailable: false,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getOrderDetail(id: string): OrderDetail | null {
  const order = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) return null;

  const driver = findDriver(order.driver);

  return {
    id:                order.id,
    status:            order.status,
    priority:          order.priority,
    createdAt:         `${order.date} at ${order.time}`,
    estimatedDelivery: `${order.date} by 18:00`,

    recipient:      order.recipient,
    recipientPhone: '+1 (206) 555-0100',
    recipientEmail: `${order.recipient.split(' ')[0].toLowerCase()}@example.com`,

    pickupAddress:   '1420 5th Ave, Seattle, WA 98101',
    deliveryAddress: order.destination,

    weight:      '2.4 kg',
    dimensions:  '30 × 20 × 15 cm',
    description: 'Standard parcel — fragile contents',
    notes: order.priority === 'HIGH' ? 'Handle with care. Signature required.' : undefined,

    driver,
    timeline: buildTimeline(order.status, order.date, order.time),

    pod: order.status === 'DELIVERED'
      ? { signedBy: order.recipient, timestamp: `${order.date} at ${order.time}`, hasPhoto: true }
      : order.status === 'FAILED'
      ? { signedBy: 'N/A', timestamp: `${order.date} at ${order.time}`, hasPhoto: false, note: 'Delivery attempted — no one present.' }
      : undefined,
  };
}
