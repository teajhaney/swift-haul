'use client';

import { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';

import { NOTIFICATIONS } from '@/constants/notifications';
import { useNotifications } from '@/hooks/notifications/use-notifications';
import { useMarkRead } from '@/hooks/notifications/use-mark-read';
import { useMarkAllRead } from '@/hooks/notifications/use-mark-all-read';
import { getPageNumbers } from '@/lib/utils';
import { NotificationRow } from '@/components/notifications/notification-row';
import { NotificationSkeleton } from '@/components/notifications/notification-skeleton';

// ─────────────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useNotifications({
    page,
    limit: NOTIFICATIONS.PAGE_SIZE,
  });
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const unreadCount = data?.meta.unreadCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / NOTIFICATIONS.PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * NOTIFICATIONS.PAGE_SIZE + 1;
  const to = Math.min(safePage * NOTIFICATIONS.PAGE_SIZE, total);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  function handleMarkAllRead() {
    markAllRead.mutate();
    setPage(1);
  }

  function handleMarkOneRead(id: string) {
    markRead.mutate(id);
  }

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {NOTIFICATIONS.PAGE_HEADING}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {NOTIFICATIONS.PAGE_SUBHEADING}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markAllRead.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors shrink-0 disabled:opacity-60"
          >
            <Bell className="w-4 h-4" />
            {NOTIFICATIONS.MARK_ALL_READ}
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      {isLoading && <NotificationSkeleton />}

      {/* ── Empty state ── */}
      {!isLoading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-text-muted" />
          </div>
          <p className="text-base font-semibold text-text-primary mb-1">
            {NOTIFICATIONS.EMPTY_HEADING}
          </p>
          <p className="text-sm text-text-secondary">
            {NOTIFICATIONS.EMPTY_BODY}
          </p>
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <>
          {/* ── Desktop list ── */}
          <div className="hidden sm:block bg-surface rounded-xl border border-border shadow-sm overflow-hidden border-l-4 border-l-primary-light">
            <div className="divide-y divide-border">
              {notifications.map(n => (
                <NotificationRow key={n.id} n={n} onRead={handleMarkOneRead} />
              ))}
            </div>
          </div>

          {/* ── Mobile list ── */}
          <div className="sm:hidden bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {notifications.map(n => (
                <NotificationRow
                  key={n.id}
                  n={n}
                  onRead={handleMarkOneRead}
                  mobile
                />
              ))}
            </div>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="pagination-footer-compact">
              <p className="text-xs text-text-secondary shrink-0">
                {NOTIFICATIONS.SHOWING(from, to, total)}
              </p>

              <div className="pagination-controls">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="pagination-nav-btn"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageNumbers.map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`pagination-page-btn text-sm font-medium ${
                      p === safePage ? 'pagination-page-btn-active' : ''
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
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
    </div>
  );
}
