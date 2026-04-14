'use client';

import { use } from 'react';
import {
  Check,
  MapPin,
  Package,
  User,
  Warehouse,
  Truck,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from 'lucide-react';
import {
  TRACKING,
  STATUS_STEP_MAP,
  MOBILE_STATUS_STEP_MAP,
  TRACKING_STATUS_COLORS,
} from '@/constants/tracking';
import { useTracking } from '@/hooks/orders/use-tracking';
import type { TrackingTimelineEvent, ApiTrackingStatusLog } from '@/types/tracking';

// Maps a status log entry's toStatus to a human label and note
const STATUS_TIMELINE_META: Record<string, { label: string; note: string }> = {
  PENDING:          { label: 'Order Placed',        note: 'Your order has been placed and is awaiting dispatch.' },
  ASSIGNED:         { label: 'Driver Assigned',      note: 'A driver has been assigned to your delivery.' },
  ACCEPTED:         { label: 'Order Accepted',       note: 'Your driver has accepted the delivery.' },
  PICKED_UP:        { label: 'Package Picked Up',    note: 'Your package has been collected by the driver.' },
  IN_TRANSIT:       { label: 'In Transit',           note: 'Your driver is on the way to your location.' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',     note: 'Your driver is nearby — delivery imminent.' },
  DELIVERED:        { label: 'Delivered',            note: 'Your package has been successfully delivered.' },
  FAILED:           { label: 'Delivery Attempted',   note: 'The delivery could not be completed. It will be rescheduled.' },
  RESCHEDULED:      { label: 'Rescheduled',          note: 'Your delivery has been rescheduled.' },
  CANCELLED:        { label: 'Cancelled',            note: 'This order has been cancelled.' },
};

function formatEventTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return time;
  if (isYesterday) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
}

function formatEstimatedDelivery(iso: string | null): string {
  if (!iso) return 'TBD';
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

function buildTimeline(
  statusLogs: ApiTrackingStatusLog[],
  currentStatus: string,
): TrackingTimelineEvent[] {
  if (statusLogs.length === 0) {
    // Only PENDING — no transitions yet
    const meta = STATUS_TIMELINE_META['PENDING'];
    return [
      {
        label: meta.label,
        time: '',
        note: meta.note,
        isCurrent: currentStatus === 'PENDING',
        isCompleted: false,
      },
    ];
  }

  // Each log entry = a completed transition; toStatus = milestone reached
  // Add an implicit PENDING entry at the bottom (orders always start PENDING)
  const events: TrackingTimelineEvent[] = [];

  // Most recent log = current status (show as active)
  const reversed = [...statusLogs].reverse();

  reversed.forEach((log, idx) => {
    const meta = STATUS_TIMELINE_META[log.toStatus] ?? {
      label: log.toStatus.replace(/_/g, ' '),
      note: '',
    };
    events.push({
      label: meta.label,
      time: formatEventTime(log.createdAt),
      note: meta.note,
      isCurrent: idx === 0,
      isCompleted: idx > 0,
    });
  });

  // Implicit PENDING entry (always the starting state, no log for it)
  const pendingMeta = STATUS_TIMELINE_META['PENDING'];
  events.push({
    label: pendingMeta.label,
    time: formatEventTime(statusLogs[0].createdAt), // use first log as proxy
    note: pendingMeta.note,
    isCurrent: false,
    isCompleted: true,
  });

  return events;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TrackingPageSkeleton() {
  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col animate-pulse">
      <header className="sm:hidden bg-surface border-b border-border h-14" />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 sm:py-10 space-y-5">
        <div className="h-24 rounded-xl bg-surface-elevated" />
        <div className="h-10 rounded-xl bg-surface-elevated" />
        <div className="h-52 rounded-xl bg-surface-elevated" />
        <div className="h-48 rounded-xl bg-surface-elevated" />
        <div className="h-40 rounded-xl bg-surface-elevated" />
      </main>
    </div>
  );
}

export default function CustomerTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { data: order, isLoading, isError } = useTracking(token);

  if (isLoading) return <TrackingPageSkeleton />;

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-text-muted" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">Shipment not found</h1>
        <p className="text-sm text-text-secondary max-w-xs">
          This tracking link is invalid or has expired. Please check your email for the correct link.
        </p>
      </div>
    );
  }

  const activeStep       = STATUS_STEP_MAP[order.status] ?? 0;
  const mobileActiveStep = MOBILE_STATUS_STEP_MAP[order.status] ?? 0;
  const statusColor      = TRACKING_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600';
  const timeline         = buildTimeline(order.statusLogs, order.status);
  const driverName       = order.driver?.name ?? 'Not yet assigned';
  const driverInitials   = order.driver ? getInitials(order.driver.name) : '—';
  const estimatedArrival = formatEstimatedDelivery(order.estimatedDelivery);

  const isFailed    = order.status === 'FAILED' || order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">

      {/* Mobile header */}
      <header className="sm:hidden bg-surface border-b border-border h-14 flex items-center justify-center px-4">
        <span className="text-base font-bold text-text-primary">{TRACKING.BRAND}</span>
      </header>

      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-6 sm:py-10 space-y-5">

          {/* Desktop: logo + title */}
          <div className="hidden sm:flex flex-col items-center text-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center shadow-md">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{TRACKING.TITLE}</h1>
            {!isFailed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                {isDelivered ? 'DELIVERED' : TRACKING.LIVE}
              </span>
            )}
          </div>

          {/* Mobile: title + tracking ID */}
          <div className="sm:hidden text-center pt-1">
            <h1 className="text-xl font-bold text-text-primary mb-1">{TRACKING.TITLE}</h1>
            <p className="font-mono text-sm text-text-muted mb-3">{order.referenceId}</p>
            <div className="flex items-center justify-between text-xs">
              {!isFailed ? (
                <span className="inline-flex items-center gap-1.5 text-success font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  {isDelivered ? 'DELIVERED' : TRACKING.LIVE_TRACKING}
                </span>
              ) : (
                <span className="text-error font-semibold text-xs">
                  {order.status.replace(/_/g, ' ')}
                </span>
              )}
              {order.statusLogs.length > 0 && (
                <span className="text-text-muted">
                  {formatEventTime(order.statusLogs[order.statusLogs.length - 1].createdAt)}
                </span>
              )}
            </div>
          </div>

          {/* Desktop: 6-step stepper */}
          {!isFailed && (
            <div className="hidden sm:flex items-center w-full">
              {TRACKING.DESKTOP_STEPS.map((label, i) => {
                const done    = i < activeStep;
                const current = i === activeStep;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                          done || current
                            ? 'bg-primary-light border-primary-light'
                            : 'bg-surface border-border'
                        }`}
                      >
                        {done ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : current ? (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        ) : null}
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wide text-center whitespace-nowrap ${
                          done || current ? 'text-primary-light' : 'text-text-muted'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < TRACKING.DESKTOP_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 mb-5 transition-colors ${
                          i < activeStep ? 'bg-primary-light' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile: 4-step stepper */}
          {!isFailed && (
            <div className="sm:hidden flex items-center w-full">
              {TRACKING.MOBILE_STEPS.map((label, i) => {
                const done    = i < mobileActiveStep;
                const current = i === mobileActiveStep;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          done || current ? 'bg-primary-light' : 'bg-border'
                        }`}
                      >
                        {done ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : current ? (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        ) : null}
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          done || current ? 'text-primary-light' : 'text-text-muted'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < TRACKING.MOBILE_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 mb-5 transition-colors ${
                          i < mobileActiveStep ? 'bg-primary-light' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Map placeholder — real Leaflet map comes in Phase 3 with GPS pings */}
          <div
            className="rounded-xl overflow-hidden border border-border shadow-sm relative h-52 sm:h-56"
            style={{
              backgroundImage: [
                'linear-gradient(rgba(203,213,225,0.4) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(203,213,225,0.4) 1px, transparent 1px)',
              ].join(', '),
              backgroundSize: '20px 20px',
              backgroundColor: '#EEF2F7',
            }}
          >
            {/* Route SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <line x1="20%" y1="60%" x2="52%" y2="44%" stroke="#1A6FB5" strokeWidth="2" strokeDasharray="7 5" strokeLinecap="round" />
              <line x1="52%" y1="44%" x2="74%" y2="58%" stroke="#10B981" strokeWidth="2" strokeDasharray="7 5" strokeLinecap="round" />
            </svg>

            {/* Depot pin */}
            <div className="absolute left-[18%] top-[58%] -translate-x-1/2 -translate-y-full">
              <div className="w-7 h-7 rounded-full bg-success border-2 border-white shadow flex items-center justify-center">
                <Warehouse className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Driver pin */}
            {order.driver && !isDelivered && (
              <div className="absolute left-[52%] top-[42%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-accent opacity-30 animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-accent border-2 border-white shadow-lg flex items-center justify-center relative">
                    <Truck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            )}

            {/* Destination pin */}
            <div className="absolute left-[74%] top-[56%] -translate-x-1/2 -translate-y-full">
              <div className={`w-7 h-7 rounded-full border-2 border-white shadow flex items-center justify-center ${isDelivered ? 'bg-success' : 'bg-primary-light'}`}>
                {isDelivered ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </div>

            {/* Mobile: ETA overlay */}
            <div className="sm:hidden absolute top-3 right-3 bg-surface rounded-xl px-3 py-2 shadow-md text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">{TRACKING.EST_ARRIVAL}</p>
              <p className="text-base font-bold text-text-primary leading-none mt-0.5">{estimatedArrival}</p>
            </div>

            {/* Desktop: bottom bar */}
            <div className="hidden sm:flex items-center justify-between absolute bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-sm px-4 py-2 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {isDelivered ? 'Delivered' : TRACKING.LIVE}
                {order.driver && ` · ${order.driver.vehicleType ?? ''}`}
              </div>
              <span className="text-xs font-bold text-primary-light">ETA {estimatedArrival}</span>
            </div>

            <p className="sm:hidden absolute bottom-2 left-2 text-[9px] text-text-muted">{TRACKING.MAP_ATTRIBUTION}</p>
            <p className="hidden sm:block absolute bottom-2 right-2 text-[9px] text-text-muted">{TRACKING.MAP_ATTRIBUTION}</p>
          </div>

          {/* Info card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Tracking ID + status */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{TRACKING.TRACKING_ID_LABEL}</p>
                <p className="font-mono text-base font-bold text-primary-light">{order.referenceId}</p>
              </div>
              <span className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase ${statusColor}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Recipient + delivery address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="flex items-start gap-3 px-5 py-4">
                <User className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{TRACKING.RECIPIENT_LABEL}</p>
                  <p className="text-sm font-semibold text-text-primary">{order.recipientName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 px-5 py-4">
                <Package className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{TRACKING.DESCRIPTION_LABEL}</p>
                  <p className="text-sm font-semibold text-text-primary">
                    {order.estimatedDelivery
                      ? `Est. ${formatEstimatedDelivery(order.estimatedDelivery)}`
                      : 'Estimated arrival TBD'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border">
              {/* Address */}
              <div className="flex items-start gap-3 px-5 py-4">
                <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{TRACKING.ADDRESS_LABEL}</p>
                  <p className="text-sm text-text-primary whitespace-pre-line">{order.deliveryAddress}</p>
                </div>
              </div>

              {/* Driver */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-xs font-bold text-white">{driverInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">{TRACKING.DRIVER_LABEL}</p>
                  <p className="text-sm font-semibold text-text-primary">{driverName}</p>
                  {order.driver?.vehicleType && (
                    <p className="text-xs text-text-secondary capitalize">{order.driver.vehicleType.toLowerCase()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
              {TRACKING.TIMELINE_HEADING}
            </p>
            <div className="space-y-4">
              {timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {/* Icon column */}
                  <div className="flex flex-col items-center shrink-0">
                    {event.isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shadow-sm">
                        <Truck className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : event.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-border-strong" />
                    )}
                    {idx < timeline.length - 1 && (
                      <span
                        className={`w-px flex-1 min-h-[16px] mt-1 ${
                          event.isCompleted ? 'bg-success' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-2 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-bold ${event.isCurrent || event.isCompleted ? 'text-text-primary' : 'text-text-muted'}`}>
                        {event.label}
                      </p>
                      {event.time && (
                        <span className="text-xs text-text-muted">{event.time}</span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center space-y-2 border-t border-border bg-surface">
        <div className="hidden sm:flex items-center justify-center gap-4">
          {[TRACKING.FOOTER_PRIVACY, TRACKING.FOOTER_TERMS, TRACKING.FOOTER_HELP].map(link => (
            <button key={link} className="text-[11px] font-semibold text-text-muted hover:text-text-secondary transition-colors tracking-wide">
              {link}
            </button>
          ))}
        </div>
        <div className="sm:hidden flex items-center justify-center gap-4">
          <button className="text-xs text-text-muted hover:text-text-secondary transition-colors">{TRACKING.HELP_CENTER}</button>
          <span className="w-1 h-1 rounded-full bg-border-strong" />
          <button className="text-xs text-text-muted hover:text-text-secondary transition-colors">{TRACKING.TERMS}</button>
        </div>
        <p className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">{TRACKING.POWERED_BY}</p>
      </footer>
    </div>
  );
}
