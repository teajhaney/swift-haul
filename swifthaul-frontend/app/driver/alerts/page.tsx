'use client';

import { useState } from 'react';
import { CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import { ALERT_TYPE_STYLES } from '@/constants/driver-alerts-mock';
import { ALERT_TYPE_ICONS, ALERTS_PAGE_SIZE } from '@/constants/driver-alerts';
import { useNotifications } from '@/hooks/notifications/use-notifications';
import { useMarkRead } from '@/hooks/notifications/use-mark-read';
import { useMarkAllRead } from '@/hooks/notifications/use-mark-all-read';
import { formatTimestamp } from '@/lib/utils';

export default function DriverAlertsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications({ page, limit: ALERTS_PAGE_SIZE });
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const pageItems = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const unreadCount = data?.meta.unreadCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ALERTS_PAGE_SIZE));
  const start = (page - 1) * ALERTS_PAGE_SIZE;

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <DriverTopbar />

      <div className="max-w-2xl mx-auto px-4 py-5 pb-24 space-y-4">

        {/* ── Heading row ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-text-primary">Alerts</h1>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-light hover:text-primary-hover transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* ── Alert list ── */}
        <div className="space-y-2">
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full h-20 rounded-xl border border-border bg-surface animate-pulse"
                />
              ))}
            </div>
          )}
          {pageItems.map(alert => {
            const styles = ALERT_TYPE_STYLES[alert.type];
            const Icon   = ALERT_TYPE_ICONS[alert.type];

            return (
              <button
                key={alert.id}
                onClick={() => {
                  if (!alert.isRead) {
                    markRead.mutate(alert.id);
                  }
                }}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                  alert.isRead
                    ? 'bg-surface border-border hover:bg-surface-elevated'
                    : 'bg-surface border-border hover:bg-surface-elevated'
                }`}
                style={!alert.isRead ? { borderLeftWidth: '3px', borderLeftColor: 'var(--color-primary-light)' } : undefined}
              >
                {/* Icon circle */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${styles.bg}`}>
                  <Icon className={`w-4 h-4 ${styles.text}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-text-primary">{alert.title}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!alert.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary-light shrink-0" />
                      )}
                      <span className="text-[10px] text-text-muted whitespace-nowrap">
                        {formatTimestamp(alert.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{alert.body}</p>
                  <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${styles.bg} ${styles.text}`}>
                    {styles.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Empty state ── */}
        {!isLoading && pageItems.length === 0 && (
          <p className="text-center text-sm text-text-muted py-8">No alerts yet.</p>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-text-muted">
              Showing {start + 1}–{Math.min(start + ALERTS_PAGE_SIZE, total)} of {total} alerts
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
