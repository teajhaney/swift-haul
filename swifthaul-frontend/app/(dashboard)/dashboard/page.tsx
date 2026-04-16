'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Filter, Download, MoreHorizontal, Calendar, ChevronRight } from 'lucide-react';

import {
  ClipboardList,
  CheckCircle2,
  Activity,
  Truck,
} from 'lucide-react';

import { KpiCard } from '@/components/analytics/kpi-card';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { DASHBOARD } from '@/constants/dashboard';
import { PRIORITY_STYLES } from '@/constants/dashboard-mock';
import { PRIORITY_LABELS } from '@/constants/orders';
import { useOrders } from '@/hooks/orders/use-orders';
import { useAnalyticsStats } from '@/hooks/analytics/use-analytics-stats';
import { useChartData } from '@/hooks/analytics/use-chart-data';
import { useStatusBreakdown } from '@/hooks/analytics/use-status-breakdown';
import type { KpiData, TimeRange } from '@/types/analytics';
import { formatTime } from '@/lib/utils';

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

const RECENT_LIMIT = 5;

// Chart components use ResizeObserver — dynamically imported to avoid SSR mismatch
const DeliveriesChart = dynamic(
  () =>
    import('@/components/analytics/deliveries-chart').then(
      m => m.DeliveriesChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] animate-pulse rounded-lg bg-surface-elevated" />
    ),
  }
);
const StatusDonut = dynamic(
  () => import('@/components/analytics/status-donut').then(m => m.StatusDonut),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] animate-pulse rounded-lg bg-surface-elevated" />
    ),
  }
);

const COMPARISON_LABELS: Record<TimeRange, string> = {
  '7d':    'Last Week',
  '30d':   'Prev. 30 Days',
  '90d':   'Prev. Quarter',
  'custom': 'Prior Period',
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    limit: RECENT_LIMIT,
    page: 1,
  });
  const { data: stats, isLoading: statsLoading } = useAnalyticsStats();

  // for custom range, only fire when both dates are filled in
  const isCustomReady = timeRange === 'custom' && !!customStart && !!customEnd;
  const { data: chartPoints } = useChartData(
    isCustomReady
      ? { startDate: customStart, endDate: customEnd }
      : { range: timeRange === 'custom' ? '7d' : timeRange },
  );
  const { data: breakdown } = useStatusBreakdown();
  const recentOrders = ordersData?.data ?? [];
  const totalOrders = ordersData?.meta.total ?? 0;

  const kpiData: KpiData[] = stats
    ? [
        {
          id: 'delivered-today',
          label: DASHBOARD.KPI_DELIVERIES_LABEL,
          value: stats.deliveredToday.toLocaleString(),
          icon: ClipboardList,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        },
        {
          id: 'success-rate',
          label: DASHBOARD.KPI_SUCCESS_LABEL,
          value: `${stats.successRate}%`,
          icon: CheckCircle2,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
        },
        {
          id: 'active-orders',
          label: DASHBOARD.KPI_ACTIVE_LABEL,
          value: stats.activeOrders.toLocaleString(),
          icon: Activity,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-500',
        },
        {
          id: 'active-drivers',
          label: DASHBOARD.KPI_DRIVERS_LABEL,
          value: stats.activeDrivers.toLocaleString(),
          icon: Truck,
          iconBg: 'bg-primary-subtle',
          iconColor: 'text-primary-light',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Mobile heading (hidden on desktop — topbar shows title) ── */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-text-primary">
          {DASHBOARD.MOBILE_HEADING}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {DASHBOARD.MOBILE_SUBHEADING}
        </p>
      </div>

      {/* ── Time range filter ── */}
      <div className="flex flex-wrap items-center gap-1.5">
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
          <div className="flex items-center gap-2 ml-1 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-sm text-text-secondary">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <input
                type="date"
                value={customStart}
                max={customEnd || undefined}
                onChange={e => setCustomStart(e.target.value)}
                className="bg-transparent text-text-primary text-sm outline-none cursor-pointer"
              />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-sm text-text-secondary">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <input
                type="date"
                value={customEnd}
                min={customStart || undefined}
                onChange={e => setCustomEnd(e.target.value)}
                className="bg-transparent text-text-primary text-sm outline-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── KPI grid — 2 cols mobile, 4 cols desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 shadow-sm animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated" />
                  <div className="w-8 h-3 rounded bg-surface-elevated" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-7 w-20 rounded bg-surface-elevated" />
                  <div className="h-3 w-28 rounded bg-surface-elevated" />
                </div>
              </div>
            ))
          : kpiData.map(kpi => (
              <KpiCard key={kpi.id} data={kpi} />
            ))}
      </div>

      {/* ── Charts — stacked mobile, side by side desktop ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Deliveries line chart */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-text-primary">
              {DASHBOARD.CHART_HEADING}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {DASHBOARD.CHART_SUBHEADING}
            </p>
          </div>
          <DeliveriesChart
            data={chartPoints ?? []}
            comparisonLabel={COMPARISON_LABELS[timeRange]}
          />
        </div>

        {/* Status donut */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-text-primary">
              {DASHBOARD.DONUT_HEADING}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {DASHBOARD.DONUT_SUBHEADING}
            </p>
          </div>
          <StatusDonut
            data={breakdown?.slices ?? []}
            total={breakdown ? formatCompact(breakdown.total) : '—'}
          />
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">
            {DASHBOARD.RECENT_ORDERS_HEADING}
          </h2>
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
              <tr className="bg-surface-elevated border-b border-border">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3">
                  {DASHBOARD.COL_TRACKING_ID}
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                  {DASHBOARD.COL_STATUS}
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                  {DASHBOARD.COL_RECIPIENT}
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                  {DASHBOARD.COL_DESTINATION}
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                  {DASHBOARD.COL_DRIVER}
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                  {DASHBOARD.COL_PRIORITY}
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                  {DASHBOARD.COL_TIME}
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ordersLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-5 py-3.5">
                        <div className="h-4 bg-surface-elevated rounded animate-pulse w-full" />
                      </td>
                    </tr>
                  ))
                : recentOrders.map(order => (
                    <tr
                      key={order.referenceId}
                      className="hover:bg-surface-elevated transition-colors group"
                    >
                      <td className="px-5 py-2">
                        <Link
                          href={`/orders/${order.referenceId}`}
                          className="font-mono text-sm font-semibold text-primary-light hover:underline"
                        >
                          {order.referenceId}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-text-primary">
                        {order.recipientName}
                      </td>
                      <td className="px-4 py-2 text-sm text-text-secondary max-w-[180px] truncate">
                        {order.deliveryAddress}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${order.driver ? 'bg-success' : 'bg-border-strong'}`}
                          />
                          <span className="text-sm text-text-primary truncate max-w-[120px]">
                            {order.driver?.name ?? DASHBOARD.UNASSIGNED}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[order.priority]}`}
                        >
                          {PRIORITY_LABELS[order.priority]}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-text-secondary font-mono">
                        {formatTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/orders/${order.referenceId}`}
                          className="icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="lg:hidden divide-y divide-border">
          {ordersLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-3.5 animate-pulse"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-elevated rounded w-24" />
                    <div className="h-4 bg-surface-elevated rounded w-32" />
                  </div>
                </div>
              ))
            : recentOrders.map(order => (
                <Link
                  key={order.referenceId}
                  href={`/orders/${order.referenceId}`}
                  className="flex items-start justify-between px-4 py-3.5 hover:bg-surface-elevated transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs font-semibold text-primary-light">
                        {order.referenceId}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {order.recipientName}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${order.driver ? 'bg-success' : 'bg-border-strong'}`}
                      />
                      {order.driver
                        ? `Driver: ${order.driver.name}`
                        : DASHBOARD.UNASSIGNED}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-text-muted shrink-0 mt-0.5">
                    {formatTime(order.createdAt)}
                  </span>
                </Link>
              ))}
        </div>

        {/* Table footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-text-secondary">
            {DASHBOARD.SHOWING_ORDERS(recentOrders.length, totalOrders)}
          </p>
          <Link
            href="/orders"
            className="text-sm font-medium text-primary-light hover:underline"
          >
            View all orders
          </Link>
        </div>
      </div>
    </div>
  );
}
