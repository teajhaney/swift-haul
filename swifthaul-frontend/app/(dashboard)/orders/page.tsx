'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  ChevronRight as ArrowRight,
  Eye,
  Trash2,
} from 'lucide-react';

import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { ORDERS, PRIORITY_STYLES, PRIORITY_LABELS } from '@/constants/orders';
import { useOrders } from '@/hooks/orders/use-orders';
import { useDeleteOrder } from '@/hooks/orders/use-delete-order';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { formatDate, getPageNumbers } from '@/lib/utils';
import type { OrderFilterStatus, PriorityFilter } from '@/types/order';

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 10;

export default function OrdersPage() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderFilterStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('ALL');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deleteOrder = useDeleteOrder();
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'ADMIN';

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  function updateStatus(val: OrderFilterStatus) {
    setStatusFilter(val);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput('');
    setDebouncedSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setPage(1);
  }

  const hasActiveFilters =
    searchInput !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  const { data, isLoading, isError } = useOrders({
    page,
    limit: PAGE_SIZE,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    search: debouncedSearch || undefined,
  });

  const orders = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, total);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  // Priority filter is client-side since the backend doesn't support it in the list endpoint
  const filtered = priorityFilter === 'ALL'
    ? orders
    : orders.filter(o => o.priority === priorityFilter);

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {ORDERS.PAGE_HEADING}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {ORDERS.PAGE_SUBHEADING}
          </p>
        </div>
        <Link
          href="/orders/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{ORDERS.NEW_ORDER_BTN}</span>
        </Link>
      </div>

      {/* ── Search + priority filter + export ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder={ORDERS.SEARCH_PLACEHOLDER}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/20 focus:border-primary-light transition-colors"
          />
        </div>

        {/* Priority filter */}
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={e => {
              setPriorityFilter(e.target.value as PriorityFilter);
              setPage(1);
            }}
            className="h-9 pl-3 pr-8 rounded-lg border border-border bg-surface text-sm text-text-secondary appearance-none focus:outline-none focus:ring-2 focus:ring-primary-light/20 focus:border-primary-light transition-colors cursor-pointer"
          >
            {ORDERS.PRIORITY_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none rotate-90" />
        </div>

        {/* Export */}
        <button
          onClick={() => toast.info('CSV export coming soon')}
          className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          {ORDERS.EXPORT_BTN}
        </button>
      </div>

      {/* ── Status filter tabs ── */}
      <div
        className="flex gap-1 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: 'none' }}
      >
        {ORDERS.STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => updateStatus(value as OrderFilterStatus)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
              statusFilter === value
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:bg-surface-elevated'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Table / Cards ── */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          /* Loading skeleton */
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
                <div className="h-4 w-24 bg-surface-elevated rounded" />
                <div className="h-5 w-20 bg-surface-elevated rounded-full" />
                <div className="h-4 w-32 bg-surface-elevated rounded flex-1" />
                <div className="h-4 w-40 bg-surface-elevated rounded flex-1" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <Package className="w-10 h-10 text-text-muted mb-4" />
            <p className="text-base font-semibold text-text-primary mb-1">
              Failed to load orders
            </p>
            <p className="text-sm text-text-secondary">
              Check your connection and try again.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-text-muted" />
            </div>
            <p className="text-base font-semibold text-text-primary mb-1">
              {ORDERS.NO_RESULTS}
            </p>
            <p className="text-sm text-text-secondary mb-5">
              {ORDERS.NO_RESULTS_HINT}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
              >
                {ORDERS.CLEAR_FILTERS}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-elevated border-b border-border">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3">
                      {ORDERS.COL_ID}
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                      {ORDERS.COL_STATUS}
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                      {ORDERS.COL_RECIPIENT}
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                      {ORDERS.COL_DESTINATION}
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                      {ORDERS.COL_DRIVER}
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                      {ORDERS.COL_PRIORITY}
                    </th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-4 py-3">
                      {ORDERS.COL_DATE}
                    </th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(order => {
                    const { date, time } = formatDate(order.createdAt);
                    return (
                      <tr
                        key={order.referenceId}
                        className="hover:bg-surface-elevated transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/orders/${order.referenceId}`}
                            className="font-mono text-sm font-semibold text-primary-light hover:underline"
                          >
                            {order.referenceId}
                          </Link>
                        </td>

                        <td className="px-4 py-3.5">
                          <OrderStatusBadge status={order.status} />
                        </td>

                        <td className="px-4 py-3.5 text-sm font-medium text-text-primary">
                          {order.recipientName}
                        </td>

                        <td className="px-4 py-3.5 text-sm text-text-secondary max-w-[180px] truncate">
                          {order.deliveryAddress}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${order.driver ? 'bg-success' : 'bg-border-strong'}`}
                            />
                            <span className="text-sm text-text-primary truncate max-w-[120px]">
                              {order.driver?.name ?? ORDERS.UNASSIGNED}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[order.priority]}`}
                          >
                            {PRIORITY_LABELS[order.priority]}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="text-sm text-text-primary">{date}</p>
                          <p className="text-xs font-mono text-text-muted">{time}</p>
                        </td>

                        <td className="px-4 py-3.5 relative">
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === order.referenceId ? null : order.referenceId)}
                              className="icon-btn opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {openMenu === order.referenceId && (
                              <div
                                className="absolute right-0 top-full mt-1 w-44 bg-surface border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                                onMouseLeave={() => setOpenMenu(null)}
                              >
                                <Link
                                  href={`/orders/${order.referenceId}`}
                                  onClick={() => setOpenMenu(null)}
                                  className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-surface-elevated transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-text-muted" />
                                  View details
                                </Link>
                                {isAdmin && (
                                  <button
                                    onClick={() => {
                                      setOpenMenu(null);
                                      deleteOrder.mutate(order.referenceId);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-error hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete order
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="lg:hidden divide-y divide-border">
              {filtered.map(order => {
                const { date, time } = formatDate(order.createdAt);
                return (
                  <Link
                    key={order.referenceId}
                    href={`/orders/${order.referenceId}`}
                    className="flex items-start justify-between px-4 py-4 hover:bg-surface-elevated transition-colors gap-3"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-primary-light">
                          {order.referenceId}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>

                      <p className="text-sm font-semibold text-text-primary truncate">
                        {order.recipientName}
                      </p>

                      <p className="text-xs text-text-secondary truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {order.deliveryAddress}
                      </p>

                      <p className="text-xs text-text-secondary flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${order.driver ? 'bg-success' : 'bg-border-strong'}`}
                        />
                        {order.driver
                          ? `${ORDERS.DRIVER_LABEL}: ${order.driver.name}`
                          : ORDERS.UNASSIGNED}
                      </p>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[order.priority]}`}
                        >
                          {order.priority}
                        </span>
                        <span className="text-xs font-mono text-text-muted">
                          {date} · {time}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-text-muted shrink-0 mt-1" />
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* ── Pagination footer ── */}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-4">
            <p className="text-xs text-text-secondary shrink-0">
              {ORDERS.SHOWING(from, to, total)}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 text-center text-xs text-text-muted"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      p === safePage
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-surface-elevated'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
