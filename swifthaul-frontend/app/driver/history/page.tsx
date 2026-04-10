'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  TrendingUp,
  Package,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import {
  MOCK_DELIVERY_HISTORY,
  HISTORY_STATS,
} from '@/constants/driver-history-mock';
import {
  HISTORY_TABS,
  HISTORY_STATUS_STYLES,
  HISTORY_PAGE_SIZE,
} from '@/constants/driver-history';
import type { HistoryFilterTab } from '@/types/driver-pages';

export default function DriverHistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryFilterTab>('week');
  const [page, setPage] = useState(1);

  // For mock purposes, show all items regardless of tab
  const items = MOCK_DELIVERY_HISTORY;
  const totalPages = Math.ceil(items.length / HISTORY_PAGE_SIZE);
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-primary-light" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Total
              </p>
              <p className="text-xl font-bold text-text-primary">
                {HISTORY_STATS.totalDeliveries}
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
                {HISTORY_STATS.thisWeek}
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
                {HISTORY_STATS.successRate}%
              </p>
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Earned
              </p>
              <p className="text-xl font-bold text-text-primary">
                {HISTORY_STATS.weekEarnings}
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
                  Status
                </th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Distance
                </th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Duration
                </th>
                <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                  Earned
                </th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, idx) => {
                const s = HISTORY_STATUS_STYLES[item.status];
                const Icon = s.icon;
                return (
                  <tr
                    key={item.orderId}
                    className={`border-b border-border last:border-0 hover:bg-surface-elevated transition-colors ${idx % 2 === 0 ? '' : 'bg-surface-elevated/30'}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">
                      {item.orderId}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">
                      {item.date}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">
                        {item.recipientName}
                      </p>
                      <p className="text-xs text-text-muted truncate max-w-[160px]">
                        {item.address}
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
                    <td className="px-4 py-3 text-xs text-right text-text-secondary">
                      {item.distanceMi}
                    </td>
                    <td className="px-4 py-3 text-xs text-right text-text-secondary">
                      {item.duration}
                    </td>
                    <td
                      className={`px-4 py-3 text-xs text-right font-semibold ${item.status === 'DELIVERED' ? 'text-success' : 'text-text-muted'}`}
                    >
                      {item.earning}
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
                key={item.orderId}
                className="bg-surface rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs text-text-muted">
                      {item.orderId}
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
                  <span className="truncate">{item.address}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted border-t border-border pt-2">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.duration}
                  </span>
                  <span>{item.distanceMi}</span>
                  <span
                    className={`ml-auto font-semibold ${item.status === 'DELIVERED' ? 'text-success' : 'text-text-muted'}`}
                  >
                    {item.earning}
                  </span>
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
