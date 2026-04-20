'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageSquare,
  Warehouse,
  CheckCircle2,
  Circle,
  Zap,
  AlertTriangle,
} from 'lucide-react';

import { DriverTopbar } from '@/components/driver/driver-topbar';
import { ReportFailedModal } from '@/components/driver/report-failed-modal';
import {
  DRIVER_QUEUE,
  CTA_CONFIG,
  DRIVER_NEXT_STATUS,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from '@/constants/driver-queue';
import { DRIVER_DETAIL_NAV as DETAIL_NAV } from '@/constants/driver-navigation';

import { useOrder } from '@/hooks/orders/use-order';
import { useUpdateStatus } from '@/hooks/orders/use-update-status';
import { formatTime } from '@/lib/utils';
import type { DriverOrderStatus } from '@/types/driver-order';
import type { FailReason } from '@/types/pod';

export default function DriverDeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [showFailedModal, setShowFailedModal] = useState(false);

  const { data: order, isLoading, isError } = useOrder(id);
  const { mutate: updateStatus, isPending } = useUpdateStatus();

  function handleCta() {
    if (!order) return;
    const nextStatus = DRIVER_NEXT_STATUS[order.status];
    if (!nextStatus) return;
    updateStatus({ referenceId: id, status: nextStatus });
  }

  function handleFailed(failReason: FailReason, notes: string) {
    updateStatus(
      {
        referenceId: id,
        status: 'FAILED',
        note: `${failReason}${notes ? `: ${notes}` : ''}`,
      },
      { onSuccess: () => setShowFailedModal(false) }
    );
  }

  if (isLoading) {
    return (
      <>
        <DriverTopbar
          backHref="/driver/orders"
          title={DRIVER_QUEUE.DETAIL_HEADING}
        />
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-border rounded mx-auto" />
          <div className="h-48 bg-surface border border-border shadow-sm rounded-xl" />
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <div className="h-32 bg-surface border border-border shadow-sm rounded-xl" />
              <div className="h-32 bg-surface border border-border shadow-sm rounded-xl" />
              <div className="h-24 bg-surface border border-border shadow-sm rounded-xl" />
            </div>
            <div className="w-full sm:w-64 shrink-0 space-y-4">
              <div className="h-40 bg-surface border border-border shadow-sm rounded-xl" />
              <div className="h-32 bg-surface border border-border shadow-sm rounded-xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError || !order) {
    return (
      <>
        <DriverTopbar
          backHref="/driver/orders"
          title={DRIVER_QUEUE.DETAIL_HEADING}
        />
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <AlertTriangle className="w-10 h-10 text-error mx-auto mb-3" />
          <p className="text-sm font-semibold text-text-primary">
            Order not found
          </p>
          <p className="text-xs text-text-muted mt-1">
            This order may have been removed or you don&apos;t have access.
          </p>
        </div>
      </>
    );
  }

  const cta = CTA_CONFIG[order.status as DriverOrderStatus] ?? null;
  const isOutForDelivery = order.status === 'OUT_FOR_DELIVERY';
  const canShowFailButton =
    cta !== null &&
    order.status !== 'DELIVERED' &&
    order.status !== 'CANCELLED';

  return (
    <>
      <DriverTopbar
        backHref="/driver/orders"
        title={DRIVER_QUEUE.DETAIL_HEADING}
      />

      <div className="max-w-2xl mx-auto px-4 py-5 pb-32 space-y-4">
        {/* ── Order ID + status ── */}
        <div className="text-center py-2">
          <span
            className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-wider uppercase mb-1 ${STATUS_COLORS[order.status as DriverOrderStatus] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {order.status.replaceAll('_', ' ')}
          </span>
          <p className="font-mono text-sm text-text-muted">
            {order.referenceId}
          </p>
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
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <line
              x1="22%"
              y1="62%"
              x2="72%"
              y2="30%"
              stroke="#1A6FB5"
              strokeWidth="2"
              strokeDasharray="7 5"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute left-[20%] top-[60%] -translate-x-1/2 -translate-y-full">
            <div className="w-7 h-7 rounded-full bg-success border-2 border-white shadow flex items-center justify-center">
              <Warehouse className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="absolute left-[50%] top-[45%] -translate-x-1/2 -translate-y-1/2">
            <div className="w-5 h-5 rounded-full bg-accent border-2 border-white shadow" />
          </div>
          <div className="absolute left-[72%] top-[28%] -translate-x-1/2 -translate-y-full">
            <div className="w-7 h-7 rounded-full bg-primary-light border-2 border-white shadow flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="absolute bottom-2 right-2 text-[10px] text-text-muted">
            Leaflet.js Data
          </p>
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
                  <h2 className="text-lg font-bold text-text-primary">
                    {order.recipientName}
                  </h2>
                </div>
                <a
                  href={`tel:${order.recipientPhone}`}
                  className="w-9 h-9 rounded-full bg-primary-subtle flex items-center justify-center text-primary-light hover:bg-primary-light hover:text-white transition-colors shrink-0"
                  aria-label="Call recipient"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <span>{order.deliveryAddress}</span>
              </div>
              {order.notes && (
                <div className="flex items-start gap-2 text-sm text-text-muted mt-2 italic">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{order.notes}</span>
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
                  <h2 className="text-base font-bold text-text-primary">
                    {order.senderName}
                  </h2>
                </div>
                <a
                  href={`tel:${order.senderPhone}`}
                  className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary hover:bg-hover-bg transition-colors shrink-0"
                  aria-label="Call pickup"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-text-secondary">
                <Warehouse className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <span>{order.pickupAddress}</span>
              </div>
            </div>

            {/* Package description */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-2">
                {DRIVER_QUEUE.PACKAGE_LABEL}
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {order.packageDescription}
              </p>
              {(order.weightKg || order.dimensions) && (
                <p className="text-xs text-text-muted mt-1">
                  {order.weightKg ? `${order.weightKg} kg` : ''}
                  {order.weightKg && order.dimensions ? ' · ' : ''}
                  {order.dimensions ?? ''}
                </p>
              )}
            </div>
          </div>

          {/* Right — Status + Timeline */}
          <div className="w-full sm:w-64 shrink-0 space-y-4">
            {/* Status card */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${STATUS_COLORS[order.status as DriverOrderStatus] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {order.status.replaceAll('_', ' ')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${PRIORITY_COLORS[order.priority] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {order.priority.replaceAll('_', ' ')}
                </span>
              </div>

              {order.estimatedDelivery && (
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                  <Zap className="w-4 h-4 text-success" />
                  <span>{formatTime(order.estimatedDelivery)}</span>
                </div>
              )}

              {cta && (
                <>
                  {isOutForDelivery ? (
                    <Link
                      href={`/driver/orders/${id}/pod`}
                      className={`w-full h-10 rounded-lg text-white text-sm font-semibold transition-colors mb-2 flex items-center justify-center ${cta.color}`}
                    >
                      {cta.label}
                    </Link>
                  ) : (
                    <button
                      onClick={handleCta}
                      disabled={isPending}
                      className={`w-full h-10 rounded-lg text-white text-sm font-semibold transition-colors mb-2 disabled:opacity-60 disabled:cursor-not-allowed ${cta.color}`}
                    >
                      {isPending ? 'Updating…' : cta.label}
                    </button>
                  )}

                  {canShowFailButton && (
                    <button
                      onClick={() => setShowFailedModal(true)}
                      className="w-full h-9 rounded-lg border border-error text-error text-sm font-medium hover:bg-error/5 transition-colors"
                    >
                      {DRIVER_QUEUE.STATUS_MARK_FAILED}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Timeline card */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                {DRIVER_QUEUE.TIMELINE_HEADING}
              </p>
              <div className="space-y-3">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      {event.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : event.isCurrent ? (
                        <Circle className="w-4 h-4 text-primary-light fill-primary-light" />
                      ) : (
                        <Circle className="w-4 h-4 text-border-strong" />
                      )}
                      {idx < order.timeline.length - 1 && (
                        <span
                          className={`w-px flex-1 min-h-[12px] mt-0.5 ${event.isCompleted ? 'bg-success' : 'bg-border'}`}
                        />
                      )}
                    </div>
                    <div className="pb-1">
                      <p
                        className={`text-xs font-semibold ${event.isCompleted || event.isCurrent ? 'text-text-primary' : 'text-text-muted'}`}
                      >
                        {event.label}
                      </p>
                      {event.timestamp && (
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {formatTime(event.timestamp)}
                        </p>
                      )}
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
                  <span className="text-[10px] font-semibold tracking-wide uppercase">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ReportFailedModal
        isOpen={showFailedModal}
        onClose={() => setShowFailedModal(false)}
        orderId={order.referenceId}
        onSubmit={handleFailed}
        isPending={isPending}
      />
    </>
  );
}
