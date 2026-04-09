'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  Truck,
  CalendarDays,
  TrendingUp,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

import { DRIVER_DETAIL } from '@/constants/driver-detail';
import { getDriverDetail } from '@/constants/driver-detail-mock';
import { AVAILABILITY_STYLES } from '@/constants/drivers-mock';
import { AssignOrderModal } from '@/components/drivers/assign-order-modal';
import type { Order } from '@/types/order';
import { toast } from 'sonner';

const STATUS_COLOR: Record<string, string> = {
  'IN TRANSIT': 'text-primary-light',
  'PICKED UP': 'text-warning',
  ACCEPTED: 'text-success',
  ASSIGNED: 'text-info',
};

const STATUS_BORDER: Record<string, string> = {
  'IN TRANSIT': 'border-l-primary-light',
  'PICKED UP': 'border-l-warning',
  ACCEPTED: 'border-l-success',
  ASSIGNED: 'border-l-info',
};

const DOT_COLOR: Record<string, string> = {
  green: 'bg-success',
  blue: 'bg-primary-light',
  amber: 'bg-warning',
  gray: 'bg-border-strong',
};

export default function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const driver = getDriverDetail(id);

  const [historyPage, setHistoryPage]   = useState(1);
  const [showAssignOrder, setShowAssignOrder] = useState(false);

  function handleOrderAssigned(order: Order) {
    toast.success(`Order ${order.id} assigned to ${driver?.name}`);
  }

  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base font-semibold text-text-primary mb-1">
          {DRIVER_DETAIL.NOT_FOUND}
        </p>
        <p className="text-sm text-text-secondary mb-5">
          {DRIVER_DETAIL.NOT_FOUND_HINT}
        </p>
        <Link
          href="/drivers"
          className="text-sm font-semibold text-primary-light hover:underline"
        >
          {DRIVER_DETAIL.BACK_TO_DRIVERS}
        </Link>
      </div>
    );
  }

  const avail = AVAILABILITY_STYLES[driver.availability];
  const successPct = driver.successRate;

  // History pagination
  const historyTotal = driver.totalHistoryCount;
  const historyPages = Math.max(
    1,
    Math.ceil(historyTotal / DRIVER_DETAIL.HISTORY_PAGE_SIZE)
  );
  const safeHPage = Math.min(historyPage, historyPages);
  const hFrom = (safeHPage - 1) * DRIVER_DETAIL.HISTORY_PAGE_SIZE;
  const hTo = hFrom + DRIVER_DETAIL.HISTORY_PAGE_SIZE;
  const historySlice = driver.deliveryHistory.slice(hFrom, hTo);

  return (
    <>
    <div className="space-y-5">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary">
        <Link
          href="/drivers"
          className="hover:text-text-primary transition-colors"
        >
          {DRIVER_DETAIL.BREADCRUMB_PARENT}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-medium">{driver.name}</span>
      </nav>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* ════ LEFT COLUMN ════ */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* ── Profile card ── */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-xl bg-primary-light flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {driver.avatarInitials}
                  </span>
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${avail.dot}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                      {driver.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-surface-elevated text-text-secondary border border-border tracking-wide">
                        {DRIVER_DETAIL.DRIVER_ROLE_BADGE}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-xs font-medium ${avail.badge.includes('text-') ? '' : ''}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${avail.dot}`} />
                        <span className="text-text-secondary">
                          {avail.label}
                        </span>
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors shrink-0">
                    <Pencil className="w-3.5 h-3.5" />
                    {DRIVER_DETAIL.EDIT_PROFILE}
                  </button>
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Mail className="w-4 h-4 text-text-muted shrink-0" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Phone className="w-4 h-4 text-text-muted shrink-0" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Truck className="w-4 h-4 text-text-muted shrink-0" />
                    <span>
                      {driver.vehicle} · {driver.vehiclePlate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CalendarDays className="w-4 h-4 text-text-muted shrink-0" />
                    <span>Member since {driver.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Deliveries */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                {DRIVER_DETAIL.STAT_TOTAL_DELIVERIES}
              </p>
              <p className="text-3xl font-bold text-text-primary leading-none mb-2">
                {driver.totalDeliveries}
              </p>
              <p className="text-xs font-medium text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {driver.monthlyChange}
              </p>
            </div>

            {/* Success Rate */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                {DRIVER_DETAIL.STAT_SUCCESS_RATE}
              </p>
              <p className="text-3xl font-bold text-text-primary leading-none mb-3">
                {successPct}%
              </p>
              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${successPct}%` }}
                />
              </div>
            </div>

            {/* Failed Deliveries */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                {DRIVER_DETAIL.STAT_FAILED_DELIVERIES}
              </p>
              <p className="text-3xl font-bold text-text-primary leading-none mb-2">
                {driver.failedDeliveries}
              </p>
              <p className="text-xs text-text-secondary">
                {DRIVER_DETAIL.FAILED_REASON_PREFIX} {driver.failedReason}
              </p>
            </div>

            {/* Avg Delivery Time */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                {DRIVER_DETAIL.STAT_AVG_TIME}
              </p>
              <p className="text-3xl font-bold text-text-primary leading-none mb-2">
                {driver.avgDeliveryTime}
              </p>
              <p className="text-xs font-medium text-success">
                {DRIVER_DETAIL.TOP_PERFORMER}
              </p>
            </div>
          </div>

          {/* ── Delivery History ── */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">
                {DRIVER_DETAIL.HISTORY_HEADING}
              </h3>
              <button className="text-sm font-semibold text-primary-light hover:text-primary-hover transition-colors">
                {DRIVER_DETAIL.HISTORY_EXPORT}
              </button>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-elevated border-b border-border">
                    {[
                      DRIVER_DETAIL.COL_TRACKING_ID,
                      DRIVER_DETAIL.COL_STATUS,
                      DRIVER_DETAIL.COL_RECIPIENT,
                      DRIVER_DETAIL.COL_COMPLETED_AT,
                    ].map(col => (
                      <th
                        key={col}
                        className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {historySlice.map(row => (
                    <tr
                      key={row.orderId}
                      className="hover:bg-surface-elevated transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/orders/${row.orderId}`}
                          className="font-mono text-sm font-semibold text-primary-light hover:underline"
                        >
                          {row.orderId}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-xs font-semibold ${row.status === 'DELIVERED' ? 'text-success' : 'text-error'}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-text-primary">
                          {row.recipientName}
                        </p>
                        <p className="text-xs text-text-secondary truncate max-w-[180px]">
                          {row.recipientAddress}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-secondary whitespace-nowrap">
                        {row.completedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden divide-y divide-border">
              {historySlice.map(row => (
                <Link
                  key={row.orderId}
                  href={`/orders/${row.orderId}`}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-surface-elevated transition-colors gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-primary-light">
                      {row.orderId}
                    </p>
                    <p className="text-sm font-medium text-text-primary mt-0.5">
                      {row.recipientName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {row.completedAt}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold shrink-0 ${row.status === 'DELIVERED' ? 'text-success' : 'text-error'}`}
                  >
                    {row.status}
                  </span>
                </Link>
              ))}
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-4">
              <p className="text-xs text-text-secondary">
                {DRIVER_DETAIL.HISTORY_SHOWING(
                  hFrom + 1,
                  Math.min(hTo, historyTotal),
                  historyTotal
                )}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                  disabled={safeHPage === 1}
                  className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setHistoryPage(p => Math.min(historyPages, p + 1))
                  }
                  disabled={safeHPage === historyPages}
                  className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div className="w-full xl:w-80 shrink-0 space-y-5">
          {/* ── Current Assignments ── */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">
                {DRIVER_DETAIL.ASSIGNMENTS_HEADING}
              </h3>
            </div>

            <div className="divide-y divide-border">
              {driver.assignments.length === 0 ? (
                <p className="px-4 py-4 text-sm text-text-muted">
                  No active assignments.
                </p>
              ) : (
                driver.assignments.map(a => (
                  <div
                    key={a.orderId}
                    className={`px-4 py-3.5 border-l-[3px] ${STATUS_BORDER[a.status] ?? 'border-l-border'}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold text-primary-light">
                        {a.orderId}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_COLOR[a.status] ?? 'text-text-muted'}`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-text-primary">
                      {a.recipientName}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 truncate">
                      {a.address}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-text-secondary">
                        {DRIVER_DETAIL.ETA_PREFIX} {a.eta}
                      </span>
                      <Link
                        href={`/orders/${a.orderId}`}
                        className="text-xs font-semibold text-primary-light hover:underline"
                      >
                        {DRIVER_DETAIL.VIEW_ORDER}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Assign new order */}
            <div className="p-3 border-t border-border">
              <button
                onClick={() => setShowAssignOrder(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border-strong text-sm font-medium text-text-secondary hover:bg-surface-elevated hover:border-primary-light hover:text-primary-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                {DRIVER_DETAIL.ASSIGN_NEW_ORDER}
              </button>
            </div>
          </div>

          {/* ── Today's Activity ── */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">
                {DRIVER_DETAIL.ACTIVITY_HEADING}
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {driver.activity.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${DOT_COLOR[event.dotColor]}`}
                    />
                    {idx < driver.activity.length - 1 && (
                      <span className="w-px flex-1 bg-border min-h-[16px]" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="text-xs text-text-muted mb-0.5">
                      {event.time}
                    </p>
                    <p className="text-sm font-semibold text-text-primary">
                      {event.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {event.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4">
              <button className="text-sm font-semibold text-primary-light hover:text-primary-hover transition-colors">
                {DRIVER_DETAIL.VIEW_FULL_LOG}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {showAssignOrder && (
      <AssignOrderModal
        driverName={driver.name}
        onConfirm={handleOrderAssigned}
        onClose={() => setShowAssignOrder(false)}
      />
    )}
    </>
  );
}
