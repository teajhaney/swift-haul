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
import { AVAILABILITY_STYLES } from '@/constants/drivers-mock';
import { AssignOrderModal } from '@/components/drivers/assign-order-modal';
import { useDriver } from '@/hooks/drivers/use-driver';
import type { Order } from '@/types/order';
import type { VehicleType } from '@/types/driver';
import { toast } from 'sonner';

const VEHICLE_LABELS: Record<VehicleType, string> = {
  BIKE: 'Bike',
  CAR: 'Car',
  VAN: 'Van',
  TRUCK: 'Truck',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: driver, isLoading, isError } = useDriver(id);
  const [showAssignOrder, setShowAssignOrder] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  function handleOrderAssigned(order: Order) {
    toast.success(`Order ${order.referenceId} assigned to ${driver?.name}`);
  }

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-6 w-40 rounded bg-surface-elevated" />
        <div className="h-48 rounded-xl bg-surface-elevated" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-surface-elevated" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !driver) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-base font-semibold text-text-primary mb-1">
          {DRIVER_DETAIL.NOT_FOUND}
        </p>
        <p className="text-sm text-text-secondary mb-5">
          {DRIVER_DETAIL.NOT_FOUND_HINT}
        </p>
        <Link href="/drivers" className="text-sm font-semibold text-primary-light hover:underline">
          {DRIVER_DETAIL.BACK_TO_DRIVERS}
        </Link>
      </div>
    );
  }

  const avail      = AVAILABILITY_STYLES[driver.availability];
  const successPct = Math.round(driver.successRate);
  const initials   = getInitials(driver.name);
  const vehicle    = VEHICLE_LABELS[driver.vehicleType];

  // History pagination — delivery history requires a separate endpoint (not yet built)
  // These are placeholders so the UI structure stays intact
  const historyTotal  = 0;
  const historyPages  = 1;
  const safeHPage     = historyPage;
  const hFrom         = 0;
  const hTo           = 0;

  return (
    <>
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/drivers" className="hover:text-text-primary transition-colors">
          {DRIVER_DETAIL.BREADCRUMB_PARENT}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-medium">{driver.name}</span>
      </nav>

      {/* Two-column layout */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">

        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Profile card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                {driver.avatarUrl ? (
                  <img
                    src={driver.avatarUrl}
                    alt={driver.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-primary-light flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  </div>
                )}
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${avail.dot}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">{driver.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-surface-elevated text-text-secondary border border-border tracking-wide">
                        {DRIVER_DETAIL.DRIVER_ROLE_BADGE}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <span className={`w-2 h-2 rounded-full ${avail.dot}`} />
                        <span className="text-text-secondary">{avail.label}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.info('Edit Profile coming soon')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors shrink-0"
                  >
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
                    <span>{driver.phone ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Truck className="w-4 h-4 text-text-muted shrink-0" />
                    <span>{vehicle} · {driver.vehiclePlate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <CalendarDays className="w-4 h-4 text-text-muted shrink-0" />
                    <span>Member since {formatMemberSince(driver.memberSince)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
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
                {driver.completedToday} today
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
                <div className="h-full rounded-full bg-success" style={{ width: `${successPct}%` }} />
              </div>
            </div>

            {/* Active Orders */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                {DRIVER_DETAIL.STAT_FAILED_DELIVERIES}
              </p>
              <p className="text-3xl font-bold text-text-primary leading-none mb-2">
                {driver.activeOrders}
              </p>
              <p className="text-xs text-text-secondary">
                of {driver.maxConcurrentOrders} max concurrent
              </p>
            </div>

            {/* Rating */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                {DRIVER_DETAIL.STAT_AVG_TIME}
              </p>
              <p className="text-3xl font-bold text-text-primary leading-none mb-2">
                ★ {driver.rating.toFixed(1)}
              </p>
              <p className="text-xs font-medium text-success">
                {successPct >= 90 ? DRIVER_DETAIL.TOP_PERFORMER : 'Good standing'}
              </p>
            </div>
          </div>

          {/* Delivery History — requires separate endpoint (coming in Phase 3) */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-text-primary">
                {DRIVER_DETAIL.HISTORY_HEADING}
              </h3>
              <button
                onClick={() => toast.info('Export coming soon')}
                className="text-sm font-semibold text-primary-light hover:text-primary-hover transition-colors"
              >
                {DRIVER_DETAIL.HISTORY_EXPORT}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <p className="text-sm text-text-muted">
                Delivery history will be available once the orders module is connected.
              </p>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-4">
              <p className="text-xs text-text-secondary">
                {DRIVER_DETAIL.HISTORY_SHOWING(hFrom, hTo, historyTotal)}
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
                  onClick={() => setHistoryPage(p => Math.min(historyPages, p + 1))}
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

        {/* RIGHT COLUMN */}
        <div className="w-full xl:w-80 shrink-0 space-y-5">

          {/* Current Assignments — requires orders module (coming in Phase 3) */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">
                {DRIVER_DETAIL.ASSIGNMENTS_HEADING}
              </h3>
            </div>

            <div className="px-4 py-4">
              <p className="text-sm text-text-muted">
                Active assignments will appear here once the orders module is connected.
              </p>
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

          {/* Today's Activity — requires status log endpoint (coming in Phase 3) */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">
                {DRIVER_DETAIL.ACTIVITY_HEADING}
              </h3>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-text-muted">
                Activity log will appear here once the orders module is connected.
              </p>
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
