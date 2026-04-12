'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Filter,
  Download,
  MoreHorizontal,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { KpiCard } from '@/components/analytics/kpi-card';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { DASHBOARD } from '@/constants/dashboard';
import {
  MOCK_KPI_DATA as KPI_DATA,
  MOCK_CHART_DATA as CHART_DATA,
  MOCK_DONUT_DATA as DONUT_DATA,
  MOCK_RECENT_ORDERS as RECENT_ORDERS,
  MOCK_TOTAL_ORDERS as TOTAL_ORDERS,
  PRIORITY_STYLES,
} from '@/constants/dashboard-mock';
import { PRIORITY_LABELS } from '@/constants/orders';
import type { TimeRange } from '@/types/analytics';

// Chart components use ResizeObserver — dynamically imported to avoid SSR mismatch
const DeliveriesChart = dynamic(
  () => import('@/components/analytics/deliveries-chart').then((m) => m.DeliveriesChart),
  { ssr: false, loading: () => <div className="h-[220px] animate-pulse rounded-lg bg-surface-elevated" /> }
);
const StatusDonut = dynamic(
  () => import('@/components/analytics/status-donut').then((m) => m.StatusDonut),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse rounded-lg bg-surface-elevated" /> }
);

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  return (
    <div className="space-y-6">

      {/* ── Mobile heading (hidden on desktop — topbar shows title) ── */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-text-primary">{DASHBOARD.MOBILE_HEADING}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{DASHBOARD.MOBILE_SUBHEADING}</p>
      </div>

      {/* ── Time range filter ── */}
      <div className="flex items-center gap-1.5">
        {DASHBOARD.TIME_RANGES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setTimeRange(value as TimeRange)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeRange === value
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            {label}
          </button>
        ))}
        {timeRange === 'custom' && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors ml-1">
            <Calendar className="w-3.5 h-3.5" />
            Select dates
          </button>
        )}
      </div>

      {/* ── KPI grid — 2 cols mobile, 4 cols desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi) => (
          <KpiCard key={kpi.id} data={kpi} />
        ))}
      </div>

      {/* ── Charts — stacked mobile, side by side desktop ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* Deliveries line chart */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-text-primary">{DASHBOARD.CHART_HEADING}</h2>
            <p className="text-xs text-text-secondary mt-0.5">{DASHBOARD.CHART_SUBHEADING}</p>
          </div>
          <DeliveriesChart data={CHART_DATA} />
        </div>

        {/* Status donut */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-text-primary">{DASHBOARD.DONUT_HEADING}</h2>
            <p className="text-xs text-text-secondary mt-0.5">{DASHBOARD.DONUT_SUBHEADING}</p>
          </div>
          <StatusDonut data={DONUT_DATA} total="4.2k" />
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">

        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">{DASHBOARD.RECENT_ORDERS_HEADING}</h2>
          <div className="flex items-center gap-2">
            {/* View All — mobile only */}
            <Link
              href="/orders"
              className="lg:hidden text-sm font-medium text-primary-light hover:underline"
            >
              {DASHBOARD.RECENT_ORDERS_VIEW_ALL}
            </Link>

            {/* Filter + Export — desktop only */}
            <button
              onClick={() => toast.info('Filter coming soon')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              {DASHBOARD.RECENT_ORDERS_FILTER}
            </button>
            <button
              onClick={() => toast.info('CSV export coming soon')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-primary-light hover:bg-primary-hover transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {DASHBOARD.RECENT_ORDERS_EXPORT}
            </button>
          </div>
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-elevated">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3">{DASHBOARD.COL_TRACKING_ID}</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">{DASHBOARD.COL_STATUS}</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">{DASHBOARD.COL_RECIPIENT}</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">{DASHBOARD.COL_DESTINATION}</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">{DASHBOARD.COL_DRIVER}</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">{DASHBOARD.COL_PRIORITY}</th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">{DASHBOARD.COL_TIME}</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.referenceId} className="hover:bg-surface-elevated transition-colors group">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/orders/${order.referenceId}`}
                      className="font-mono text-sm font-medium text-primary-light hover:underline"
                    >
                      {order.referenceId}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5 text-sm text-text-primary font-medium">{order.recipient}</td>
                  <td className="px-4 py-3.5 text-sm text-text-secondary max-w-[160px] truncate">{order.destination}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${order.driver ? 'bg-success' : 'bg-border-strong'}`} />
                      <span className="text-sm text-text-primary truncate max-w-[120px]">
                        {order.driver ?? DASHBOARD.UNASSIGNED}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[order.priority]}`}>
                      {PRIORITY_LABELS[order.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-text-secondary font-mono">{order.time}</td>
                  <td className="px-4 py-3.5">
                    <button className="icon-btn opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="lg:hidden divide-y divide-border">
          {RECENT_ORDERS.map((order) => (
            <Link
              key={order.referenceId}
              href={`/orders/${order.referenceId}`}
              className="flex items-start justify-between px-4 py-3.5 hover:bg-surface-elevated transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-semibold text-primary-light">{order.referenceId}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm font-semibold text-text-primary truncate">{order.recipient}</p>
                <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${order.driver ? 'bg-success' : 'bg-border-strong'}`} />
                  {order.driver ? `Driver: ${order.driver}` : DASHBOARD.UNASSIGNED}
                </p>
              </div>
              <span className="text-xs font-mono text-text-muted shrink-0 mt-0.5">{order.time}</span>
            </Link>
          ))}
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-text-secondary">
            {DASHBOARD.SHOWING_ORDERS(RECENT_ORDERS.length, TOTAL_ORDERS)}
          </p>
          <div className="flex items-center gap-1">
            <button className="icon-btn opacity-50 cursor-not-allowed" disabled aria-label="Previous page">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="icon-btn" aria-label="Next page">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
