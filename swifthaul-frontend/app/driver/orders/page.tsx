'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
} from 'lucide-react';

import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';

import { DRIVER_QUEUE, QUEUE_PAGE_SIZE } from '@/constants/driver-queue';
import {
  MOCK_ACTIVE_DELIVERY,
  MOCK_QUEUE,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from '@/constants/driver-queue-mock';

export default function DriverOrderQueuePage() {
  const active = MOCK_ACTIVE_DELIVERY;
  const queue = MOCK_QUEUE;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(queue.length / QUEUE_PAGE_SIZE);
  const start = (page - 1) * QUEUE_PAGE_SIZE;
  const pageQueue = queue.slice(start, start + QUEUE_PAGE_SIZE);

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }

  return (
    <>
      <DriverTopbar />

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-6">
        {/* ── Active Delivery ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-success" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              {DRIVER_QUEUE.ACTIVE_DELIVERY_HEADING}
            </h2>
            {/* Mobile: Online indicator */}
            <span className="ml-auto sm:hidden text-xs font-semibold text-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              {DRIVER_QUEUE.ONLINE_STATUS}
            </span>
          </div>

          {/* Active delivery card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Left — order info */}
              <div className="flex-1 p-5">
                {/* Status + priority row */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase ${STATUS_COLORS[active.status]}`}
                  >
                    {active.status.replaceAll('_', ' ')}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase ml-auto sm:ml-0 ${PRIORITY_COLORS[active.priority]}`}
                  >
                    {active.priority} PRIORITY
                  </span>
                </div>

                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                  Recipient
                </p>
                <p className="text-xl font-bold text-text-primary mb-3">
                  {active.recipientName}
                </p>

                <div className="flex items-start gap-2 text-sm text-text-secondary mb-4">
                  <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                  <span>{active.deliveryAddress}</span>
                </div>

                {/* Mobile: ETA + view details */}
                <div className="sm:hidden flex items-center gap-2 mb-4 text-sm">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">
                    {DRIVER_QUEUE.EST_DELIVERY_PREFIX}{' '}
                    <span className="font-semibold text-text-primary">
                      {active.estimatedDelivery}
                    </span>
                  </span>
                  <Link
                    href={`/driver/orders/${active.orderId}`}
                    className="ml-auto text-sm font-semibold text-primary-light whitespace-nowrap"
                  >
                    {DRIVER_QUEUE.VIEW_DETAILS}
                  </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/driver/orders/${active.orderId}`}
                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {DRIVER_QUEUE.MARK_DELIVERED}
                  </Link>
                  <a
                    href={`tel:${active.recipientPhone}`}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:bg-surface-elevated transition-colors"
                    aria-label="Call recipient"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right — map placeholder (desktop only) */}
              <div
                className="hidden sm:block w-56 shrink-0 relative"
                style={{
                  backgroundImage: [
                    'linear-gradient(rgba(203,213,225,0.4) 1px, transparent 1px)',
                    'linear-gradient(90deg, rgba(203,213,225,0.4) 1px, transparent 1px)',
                  ].join(', '),
                  backgroundSize: '20px 20px',
                  backgroundColor: '#EEF2F7',
                }}
              >
                {/* Route line */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="25%"
                    y1="30%"
                    x2="70%"
                    y2="65%"
                    stroke="#1A6FB5"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Pickup pin */}
                <div className="absolute left-[23%] top-[26%] -translate-x-1/2 -translate-y-full">
                  <div className="w-5 h-5 rounded-full bg-primary-light border-2 border-white shadow flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                {/* Driver pin (accent) */}
                <div className="absolute left-[55%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 rounded-full bg-accent border-2 border-white shadow flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                {/* Destination pin */}
                <div className="absolute left-[70%] top-[65%] -translate-x-1/2 -translate-y-full">
                  <div className="w-5 h-5 rounded-full bg-success border-2 border-white shadow flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                {/* Distance badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-surface/90 rounded text-[10px] font-semibold text-text-primary shadow">
                  {active.distanceMiles} {DRIVER_QUEUE.MILES_SUFFIX}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Upcoming Deliveries ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-text-primary">
                {DRIVER_QUEUE.UPCOMING_HEADING}
              </h2>
              <span className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-[10px] font-bold text-white">
                {queue.length}
              </span>
              <span className="text-xs text-text-muted hidden sm:inline">
                ({start + 1}–{Math.min(start + QUEUE_PAGE_SIZE, queue.length)}{' '}
                of {queue.length})
              </span>
            </div>
            <button className="text-sm font-semibold text-primary-light hover:text-primary-hover transition-colors">
              {DRIVER_QUEUE.VIEW_SCHEDULE}
            </button>
          </div>

          {/* Desktop: 2-column grid */}
          <div className="hidden sm:grid grid-cols-2 gap-3">
            {pageQueue.map(order => (
              <Link
                key={order.orderId}
                href={`/driver/orders/${order.orderId}`}
                className="bg-surface rounded-xl border border-border shadow-sm p-4 hover:bg-surface-elevated transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-text-muted">
                    {order.orderId}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-info/10 text-info tracking-wide">
                    ASSIGNED
                  </span>
                </div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  {order.recipientName}
                </p>
                <p className="text-xs text-text-secondary truncate mb-3">
                  {order.address}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {order.timeWindow}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-3">
            {pageQueue.map(order => (
              <Link
                key={order.orderId}
                href={`/driver/orders/${order.orderId}`}
                className="bg-surface rounded-xl border border-border shadow-sm p-4 flex items-start gap-3 hover:bg-surface-elevated transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold text-text-muted">
                      {order.orderId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-info/10 text-info tracking-wide">
                      ASSIGNED
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">
                    {order.recipientName}
                  </p>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {order.address}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    <span>{order.weight}</span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {order.distanceMi}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-text-muted sm:hidden">
                {start + 1}–{Math.min(start + QUEUE_PAGE_SIZE, queue.length)} of{' '}
                {queue.length}
              </p>
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => goTo(page - 1)}
                  disabled={page === 1}
                  className="pagination-nav-btn"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      p === page
                        ? 'bg-primary-light text-white'
                        : 'border border-border text-text-secondary hover:bg-surface-elevated'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => goTo(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-nav-btn"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <DriverBottomNav />
    </>
  );
}
