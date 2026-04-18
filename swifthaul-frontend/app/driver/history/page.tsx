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

type HistoryStatus = 'DELIVERED' | 'FAILED';
type HistoryOrderItem = ApiOrderListItem & { status: HistoryStatus };
const HISTORY_RENDER_BASE_MS = Date.now();

function isHistoryOrderItem(order: ApiOrderListItem): order is HistoryOrderItem {
  return order.status === 'DELIVERED' || order.status === 'FAILED';
}

export default function DriverHistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryFilterTab>('week');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ page: 1, limit: 50 });

  const allOrders: ApiOrderListItem[] = data?.data ?? [];
  const historyBase = allOrders.filter(isHistoryOrderItem);
  const items = historyBase.filter((item) => {
    const diffDays =
      (HISTORY_RENDER_BASE_MS - new Date(item.updatedAt).getTime()) /
      (1000 * 60 * 60 * 24);
    if (activeTab === 'today') return diffDays < 1;
    if (activeTab === 'week') return diffDays < 7;
    if (activeTab === 'month') return diffDays < 30;
    return true;
  });

  const deliveredCount = items.filter(
    item => item.status === 'DELIVERED'
  ).length;
  const failedCount = items.filter(item => item.status === 'FAILED').length;
  const totalPages = Math.max(1, Math.ceil(items.length / HISTORY_PAGE_SIZE));
  const start = (page - 1) * HISTORY_PAGE_SIZE;
  const pageItems = items.slice(start, start + HISTORY_PAGE_SIZE);

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
                {items.length}
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
                {historyBase.filter((item) => {
                  const diffDays =
                    (HISTORY_RENDER_BASE_MS - new Date(item.updatedAt).getTime()) /
                    (1000 * 60 * 60 * 24);
                  return diffDays < 7;
                }).length}
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
              <p className="text-xl font-bold text-text-primary">
                {deliveredCount + failedCount > 0
                  ? Math.round(
                      (deliveredCount / (deliveredCount + failedCount)) * 100
                    )
                  : 0}
                %
              </p>
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
                const s = HISTORY_STATUS_STYLES[item.status];
                const Icon = s.icon;
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
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}
                      >
                        <Icon className="w-3 h-3" />
                        {item.status}
                      </span>
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
            const s = HISTORY_STATUS_STYLES[item.status];
            const Icon = s.icon;
            return (
              <div
                key={item.referenceId}
                className="bg-surface rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs text-text-muted">
                      {item.referenceId}
                    </span>
                    <p className="text-sm font-semibold text-text-primary mt-0.5">
                      {item.recipientName}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${s.bg} ${s.text}`}
                  >
                    <Icon className="w-3 h-3" />
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary mb-3">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.deliveryAddress}</span>
                </div>
                <div className="text-xs text-text-muted border-t border-border pt-2">
                  {formatDateString(item.updatedAt)}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-text-muted">
              Showing {start + 1}–
              {Math.min(start + HISTORY_PAGE_SIZE, items.length)} of{' '}
              {items.length} deliveries
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
