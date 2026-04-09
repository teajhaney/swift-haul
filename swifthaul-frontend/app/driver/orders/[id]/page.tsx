'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageSquare,
  Warehouse,
  CheckCircle2,
  Circle,
  Zap,
  Truck,
  LayoutList,
  UserCircle2,
} from 'lucide-react';

import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DRIVER_QUEUE } from '@/constants/driver-queue';
import {
  MOCK_DELIVERY_DETAILS,
  MOCK_ACTIVE_DELIVERY,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from '@/constants/driver-queue-mock';
import type { DriverOrderStatus } from '@/types/driver-order';

// ── CTA config per status ─────────────────────────────────────

const CTA_CONFIG: Record<DriverOrderStatus, { label: string; color: string } | null> = {
  ASSIGNED:         null,
  ACCEPTED:         { label: DRIVER_QUEUE.STATUS_ACCEPTED,        color: 'bg-warning hover:bg-amber-600' },
  PICKED_UP:        { label: DRIVER_QUEUE.STATUS_MARK_DELIVERED,  color: 'bg-purple-600 hover:bg-purple-700' },
  IN_TRANSIT:       { label: DRIVER_QUEUE.STATUS_MARK_DELIVERED,  color: 'bg-purple-600 hover:bg-purple-700' },
  OUT_FOR_DELIVERY: { label: DRIVER_QUEUE.STATUS_OUT_FOR_DELIVERY, color: 'bg-success hover:bg-emerald-600' },
  DELIVERED:        null,
  FAILED:           null,
  PENDING:          null,
};

// ── Detail page bottom nav (mobile) ──────────────────────────

const DETAIL_NAV = [
  { label: DRIVER_QUEUE.NAV_ROUTES,  icon: LayoutList,  href: '/driver/orders' },
  { label: DRIVER_QUEUE.NAV_ACTIVE,  icon: Truck,       href: `/driver/orders/${MOCK_ACTIVE_DELIVERY.orderId}` },
  { label: DRIVER_QUEUE.NAV_PROFILE, icon: UserCircle2, href: '/driver/profile' },
];

// ─────────────────────────────────────────────────────────────

export default function DriverDeliveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const detail = MOCK_DELIVERY_DETAILS[id] ?? {
    ...MOCK_DELIVERY_DETAILS['SH-a8f3r7v2'],
    orderId: id,
  };

  const cta = CTA_CONFIG[detail.status];

  return (
    <>
      <DriverTopbar backHref="/driver/orders" title={DRIVER_QUEUE.DETAIL_HEADING} />

      <div className="max-w-2xl mx-auto px-4 py-5 pb-32 space-y-4">

        {/* ── Order ID + status ── */}
        <div className="text-center py-2">
          <span className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-wider uppercase mb-1 ${STATUS_COLORS[detail.status]}`}>
            {detail.status.replace('_', ' ')}
          </span>
          <p className="font-mono text-sm text-text-muted">{detail.orderId}</p>
        </div>

        {/* ── Map placeholder ── */}
        <div
          className="rounded-xl overflow-hidden border border-border shadow-sm relative h-48"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(203,213,225,0.4) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(203,213,225,0.4) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '20px 20px',
            backgroundColor: '#EEF2F7',
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <line x1="22%" y1="62%" x2="72%" y2="30%" stroke="#1A6FB5" strokeWidth="2" strokeDasharray="7 5" strokeLinecap="round" />
          </svg>
          {/* Pickup pin */}
          <div className="absolute left-[20%] top-[60%] -translate-x-1/2 -translate-y-full">
            <div className="w-7 h-7 rounded-full bg-success border-2 border-white shadow flex items-center justify-center">
              <Warehouse className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          {/* Driver dot */}
          <div className="absolute left-[50%] top-[45%] -translate-x-1/2 -translate-y-1/2">
            <div className="w-5 h-5 rounded-full bg-accent border-2 border-white shadow" />
          </div>
          {/* Destination pin */}
          <div className="absolute left-[72%] top-[28%] -translate-x-1/2 -translate-y-full">
            <div className="w-7 h-7 rounded-full bg-primary-light border-2 border-white shadow flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="absolute bottom-2 right-2 text-[10px] text-text-muted">Leaflet.js Data</p>
        </div>

        {/* ── Desktop two-col / Mobile stacked ── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">

          {/* Left — Order Details */}
          <div className="flex-1 space-y-4">

            {/* Recipient card */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">
                    {DRIVER_QUEUE.RECIPIENT_LABEL}
                  </p>
                  <h2 className="text-lg font-bold text-text-primary">{detail.recipientName}</h2>
                </div>
                <a
                  href={`tel:${detail.recipientPhone}`}
                  className="w-9 h-9 rounded-full bg-primary-subtle flex items-center justify-center text-primary-light hover:bg-primary-light hover:text-white transition-colors shrink-0"
                  aria-label="Call recipient"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <span>{detail.recipientAddress}</span>
              </div>
              {detail.deliveryNotes && (
                <div className="flex items-start gap-2 text-sm text-text-muted mt-2 italic">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{detail.deliveryNotes}</span>
                </div>
              )}
            </div>

            {/* Pickup card */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-1">
                    {DRIVER_QUEUE.SENDER_LABEL}
                  </p>
                  <h2 className="text-base font-bold text-text-primary">{detail.pickupName}</h2>
                </div>
                <a
                  href={`tel:${detail.pickupPhone}`}
                  className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:bg-hover-bg transition-colors shrink-0"
                  aria-label="Call pickup"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-text-secondary">
                <Warehouse className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <span>{detail.pickupAddress}</span>
              </div>
            </div>

            {/* Package description */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">
                {DRIVER_QUEUE.PACKAGE_LABEL}
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">{detail.packageDescription}</p>
            </div>
          </div>

          {/* Right — Status + Timeline */}
          <div className="w-full sm:w-64 shrink-0 space-y-4">

            {/* Status card */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${STATUS_COLORS[detail.status]}`}>
                  {detail.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${PRIORITY_COLORS[detail.priority]}`}>
                  {detail.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                <Zap className="w-4 h-4 text-success" />
                <span>{detail.estimatedDelivery}</span>
              </div>
              {cta && (
                <>
                  <button className={`w-full h-10 rounded-lg text-white text-sm font-semibold transition-colors mb-2 ${cta.color}`}>
                    {cta.label}
                  </button>
                  <button className="w-full h-9 rounded-lg border border-error text-error text-sm font-medium hover:bg-error/5 transition-colors">
                    {DRIVER_QUEUE.STATUS_MARK_FAILED}
                  </button>
                </>
              )}
            </div>

            {/* Timeline card */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                {DRIVER_QUEUE.TIMELINE_HEADING}
              </p>
              <div className="space-y-3">
                {detail.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      {event.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : event.isCurrent ? (
                        <Circle className="w-4 h-4 text-primary-light fill-primary-light" />
                      ) : (
                        <Circle className="w-4 h-4 text-border-strong" />
                      )}
                      {idx < detail.timeline.length - 1 && (
                        <span className={`w-px flex-1 min-h-[12px] mt-0.5 ${event.isCompleted ? 'bg-success' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className={`text-xs font-semibold ${event.isCompleted || event.isCurrent ? 'text-text-primary' : 'text-text-muted'}`}>
                        {event.label}
                      </p>
                      {event.time && <p className="text-[10px] text-text-muted mt-0.5">{event.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Driver bottom nav (mobile) ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border h-16">
        <ul className="flex h-full">
          {DETAIL_NAV.map(({ label, icon: Icon, href }) => {
            const isActive = label === DRIVER_QUEUE.NAV_ACTIVE;
            return (
              <li key={label} className="flex-1">
                <Link
                  href={href}
                  className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${isActive ? 'text-primary-light' : 'text-text-muted'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-semibold tracking-wide uppercase">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
