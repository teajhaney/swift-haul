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
  Package,
} from 'lucide-react';

import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';

import {
  DRIVER_QUEUE,
  QUEUE_PAGE_SIZE,
  DRIVER_ACTIVE_STATUSES,
  PRIORITY_COLORS,
} from '@/constants/driver-queue';

import { useOrders } from '@/hooks/orders/use-orders';
import { useMe } from '@/hooks/auth/use-me';
import { formatTime, getPageNumbers } from '@/lib/utils';
import type { ApiOrderListItem, OrderStatus } from '@/types/order';

const STATUS_PRIORITY: Record<OrderStatus, number> = {
  PENDING: 0,
  ASSIGNED: 1,
  ACCEPTED: 2,
  PICKED_UP: 3,
  IN_TRANSIT: 4,
  OUT_FOR_DELIVERY: 5,
  DELIVERED: 6,
  FAILED: 6,
  RESCHEDULED: 1,
  CANCELLED: 6,
};

export default function DriverOrderQueuePage() {
  const { data: me, isLoading: meLoading } = useMe();
  const [page, setPage] = useState(1);

  // backend auto-filters to this driver's orders when role=DRIVER
  // backend ListOrdersDto enforces max limit=50
  // only fetch active/pending orders for the queue
  const activeStatusList = [
    'ASSIGNED',
    'ACCEPTED',
    'PICKED_UP',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
  ].join(',');

  const { data, isLoading: ordersLoading, isError } = useOrders({ 
    page, 
    limit: QUEUE_PAGE_SIZE,
    driverId: me?.id,
    statuses: activeStatusList,
  });

  const isLoading = meLoading || ordersLoading;

  const allOrders: ApiOrderListItem[] = [...(data?.data ?? [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Keep exactly one primary active order; keep additional accepted orders in upcoming.
  const inProgress = allOrders.filter(order =>
    DRIVER_ACTIVE_STATUSES.includes(order.status)
  );
  const activeOrder = [...inProgress].sort((a, b) => {
    const statusDelta = STATUS_PRIORITY[b.status] - STATUS_PRIORITY[a.status];
    if (statusDelta !== 0) return statusDelta;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  })[0];

  const queue = allOrders.filter(order => {
    if (order.referenceId === activeOrder?.referenceId) return false;
    return order.status === 'ASSIGNED' || order.status === 'ACCEPTED';
  });

  // Server-side pagination metadata
  // Upcoming deliveries count: Total active from backend minus the 1 currently active order
  const totalUpcoming = Math.max(0, (data?.meta.total ?? 0) - (activeOrder ? 1 : 0));
  const totalPages = data?.meta.total ? Math.ceil(data.meta.total / QUEUE_PAGE_SIZE) : 1;
  const pageNumbers = getPageNumbers(page, totalPages);

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          </div>

          {isLoading ? (
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5 animate-pulse">
              <div className="h-5 w-40 bg-surface-elevated rounded mb-3" />
              <div className="h-7 w-56 bg-surface-elevated rounded mb-3" />
              <div className="h-4 w-72 bg-surface-elevated rounded mb-4" />
              <div className="h-10 w-full bg-surface-elevated rounded" />
            </div>
          ) : activeOrder ? (
            <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Left — order info */}
                <div className="flex-1 p-5">
                  {/* Status + priority row */}
                  <div className="flex items-center gap-2 mb-3">
                    <OrderStatusBadge status={activeOrder.status} />
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase ml-auto sm:ml-0 ${PRIORITY_COLORS[activeOrder.priority] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {activeOrder.priority.replaceAll('_', ' ')} PRIORITY
                    </span>
                  </div>

                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">
                    Recipient
                  </p>
                  <p className="text-xl font-bold text-text-primary mb-3">
                    {activeOrder.recipientName}
                  </p>

                  <div className="flex items-start gap-2 text-sm text-text-secondary mb-4">
                    <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                    <span>{activeOrder.deliveryAddress}</span>
                  </div>

                  {/* ETA row */}
                  {activeOrder.estimatedDelivery && (
                    <div className="sm:hidden flex items-center gap-2 mb-4 text-sm">
                      <Clock className="w-4 h-4 text-text-muted" />
                      <span className="text-text-secondary">
                        {DRIVER_QUEUE.EST_DELIVERY_PREFIX}{' '}
                        <span className="font-semibold text-text-primary">
                          {formatTime(activeOrder.estimatedDelivery)}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/driver/orders/${activeOrder.referenceId}`}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {DRIVER_QUEUE.VIEW_DETAILS}
                    </Link>
                    <a
                      href={`tel:${activeOrder.recipientPhone}`}
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
                  <div className="absolute left-[23%] top-[26%] -translate-x-1/2 -translate-y-full">
                    <div className="w-5 h-5 rounded-full bg-primary-light border-2 border-white shadow flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="absolute left-[55%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-accent border-2 border-white shadow flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                  <div className="absolute left-[70%] top-[65%] -translate-x-1/2 -translate-y-full">
                    <div className="w-5 h-5 rounded-full bg-success border-2 border-white shadow flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col items-center text-center gap-2">
              <Package className="w-10 h-10 text-text-muted" />
              <p className="text-sm font-semibold text-text-primary">
                {DRIVER_QUEUE.NO_ACTIVE}
              </p>
              <p className="text-xs text-text-muted">
                {DRIVER_QUEUE.NO_ACTIVE_HINT}
              </p>
            </div>
          )}
        </section>

        {/* ── Upcoming Deliveries ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-text-primary">
                {DRIVER_QUEUE.UPCOMING_HEADING}
              </h2>
              {!isLoading && (
                <span className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center text-[10px] font-bold text-white">
                  {totalUpcoming}
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-xl border border-border p-4 animate-pulse"
                >
                  <div className="h-3 w-24 bg-surface-elevated rounded mb-2" />
                  <div className="h-4 w-40 bg-surface-elevated rounded mb-2" />
                  <div className="h-3 w-56 bg-surface-elevated rounded" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="bg-surface rounded-xl border border-border p-5 text-center">
              <p className="text-sm text-error">
                Unable to load upcoming deliveries right now.
              </p>
            </div>
          ) : queue.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border p-5 text-center">
              <p className="text-sm text-text-muted">
                No upcoming deliveries assigned.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop: 2-column grid */}
              <div className="hidden sm:grid grid-cols-2 gap-3">
                {queue.map(order => (
                  <Link
                    key={order.referenceId}
                    href={`/driver/orders/${order.referenceId}`}
                    className="bg-surface rounded-xl border border-border shadow-sm p-4 hover:bg-surface-elevated transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-text-muted">
                        {order.referenceId}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm font-semibold text-text-primary mb-1">
                      {order.recipientName}
                    </p>
                    <p className="text-xs text-text-secondary truncate mb-3">
                      {order.deliveryAddress}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.estimatedDelivery
                          ? formatTime(order.estimatedDelivery)
                          : '—'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile: stacked cards */}
              <div className="sm:hidden space-y-3">
                {queue.map(order => (
                  <Link
                    key={order.referenceId}
                    href={`/driver/orders/${order.referenceId}`}
                    className="bg-surface rounded-xl border border-border shadow-sm p-4 flex items-start gap-3 hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-semibold text-text-muted">
                          {order.referenceId}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm font-semibold text-text-primary">
                        {order.recipientName}
                      </p>
                      <p className="text-xs text-text-secondary truncate mt-0.5">
                        {order.deliveryAddress}
                      </p>
                      {order.estimatedDelivery && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(order.estimatedDelivery)}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="pagination-footer-compact mt-4">
                  <p className="text-xs text-text-muted sm:hidden">
                    Page {page} of {totalPages}
                  </p>
                  <div className="pagination-controls ml-auto sm:ml-0">
                    <button
                      onClick={() => goTo(page - 1)}
                      disabled={page === 1}
                      className="pagination-nav-btn"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {pageNumbers.map(p => (
                      <button
                        key={p}
                        onClick={() => goTo(p)}
                        className={`pagination-page-btn ${
                          p === page ? 'pagination-page-btn-active' : ''
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
            </>
          )}
        </section>
      </div>

      <DriverBottomNav />
    </>
  );
}
