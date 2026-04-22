'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  TrendingUp,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import {
  HISTORY_TABS,
  HISTORY_STATUS_STYLES,
  HISTORY_PAGE_SIZE,
} from '@/constants/driver-history';
import type { HistoryFilterTab } from '@/types/driver-pages';
import { useOrders } from '@/hooks/orders/use-orders';
import { formatDateString } from '@/lib/utils';
import type { ApiOrderListItem } from '@/types/order';
import { useMe } from '@/hooks/auth/use-me';

type HistoryStatus = 'DELIVERED' | 'FAILED';
type HistoryOrderItem = ApiOrderListItem & { status: HistoryStatus };
const HISTORY_RENDER_BASE_MS = Date.now();

function isHistoryOrderItem(
  order: ApiOrderListItem
): order is HistoryOrderItem {
  return order.status === 'DELIVERED' || order.status === 'FAILED';
}

export default function DriverHistoryPage() {
  const { data: me, isLoading: meLoading } = useMe();
  const [activeTab, setActiveTab] = useState<HistoryFilterTab>('week');
  const [page, setPage] = useState(1);

  // Map tabs to dateFrom strings
  const getDateFrom = () => {
    if (activeTab === 'all') return undefined;
    const date = new Date();
    if (activeTab === 'today') date.setHours(0, 0, 0, 0);
    else if (activeTab === 'week') date.setDate(date.getDate() - 7);
    else if (activeTab === 'month') date.setMonth(date.getMonth() - 1);
    return date.toISOString();
  };

  const { data, isLoading: ordersLoading } = useOrders({
    page,
    limit: HISTORY_PAGE_SIZE,
    driverId: me?.id,
    statuses: 'DELIVERED,FAILED',
    dateFrom: getDateFrom(),
  });

  const isLoading = meLoading || (!!me?.id && ordersLoading);

  const pageItems: ApiOrderListItem[] = data?.data ?? [];
  // No more local filtering needed since the backend handles it via statuses param

  // Stats - strictly speaking, these should come from a summary API,
  // but we can use the metadata total for the current view.
  const totalCount = data?.meta.total ?? 0;
  const totalPages = data?.meta.total
    ? Math.ceil(data.meta.total / HISTORY_PAGE_SIZE)
    : 1;

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function changeTab(tab: HistoryFilterTab) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <>
      <DriverTopbar />

      <div className="max-w-3xl mx-auto px-4 py-5 pb-24 space-y-5">
        <h1 className="text-base font-bold text-text-primary">
          Delivery History
        </h1>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-primary-light" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Total
              </p>
              <p className="text-xl font-bold text-text-primary">
                {totalCount}
              </p>
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-info" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                This Week
              </p>
              <p className="text-xl font-bold text-text-primary">
                {activeTab === 'all' ? '—' : totalCount}
              </p>
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                On-time
              </p>
              <p className="text-xl font-bold text-text-primary">—</p>
            </div>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 border border-border">
          {HISTORY_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => changeTab(tab.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-surface text-text-primary shadow-sm border border-border'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Desktop table / Mobile cards ── */}

        {/* Desktop table */}
        <div className="hidden sm:block bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-elevated">
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Recipient
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Address
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-4">
                    <div className="h-24 bg-surface-elevated rounded animate-pulse" />
                  </td>
                </tr>
              )}
              {pageItems.map((item, idx) => {
                const isHistory = isHistoryOrderItem(item);
                const s = isHistory ? HISTORY_STATUS_STYLES[item.status] : null;
                const Icon = s?.icon;
                return (
                  <tr
                    key={item.referenceId}
                    className={`border-b border-border last:border-0 hover:bg-surface-elevated transition-colors ${idx % 2 === 0 ? '' : 'bg-surface-elevated/30'}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">
                      {item.referenceId}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      {formatDateString(item.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">
                        {item.recipientName}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-text-secondary truncate max-w-[220px]">
                        {item.deliveryAddress}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {s && Icon && (
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${s.bg} ${s.text} text-[10px] font-bold uppercase tracking-wider`}>
                          <Icon className="w-3 h-3" />
                          {item.status.replace('_', ' ')}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {pageItems.map(item => {
            const isHistory = isHistoryOrderItem(item);
            const s = isHistory ? HISTORY_STATUS_STYLES[item.status] : null;
            const Icon = s?.icon;
            return (
              <div
                key={item.referenceId}
                className="bg-surface rounded-xl border border-border p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-text-muted">
                    {item.referenceId}
                  </span>
                  {s && Icon && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.bg} ${s.text} text-[10px] font-bold uppercase`}>
                      <Icon className="w-2.5 h-2.5" />
                      {item.status.replace('_', ' ')}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {item.recipientName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.deliveryAddress}</span>
                  </div>
                </div>

                <div className="text-[10px] text-text-muted border-t border-border pt-2 flex justify-between">
                   <span>{item.referenceId}</span>
                   <span>{formatDateString(item.updatedAt)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-text-muted">
              Page {page} of {totalPages} ({totalCount} deliveries)
            </p>
            <div className="flex items-center gap-1">
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
      </div>

      <DriverBottomNav />
    </>
  );
}
