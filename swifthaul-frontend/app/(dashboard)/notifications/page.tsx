'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';

import { NotificationIcon } from '@/components/notifications/notification-icon';
import { NOTIFICATIONS } from '@/constants/notifications';
import { MOCK_NOTIFICATIONS } from '@/constants/notifications-mock';
import type { AppNotification } from '@/types/notification';

// ── Rich message renderer ─────────────────────────────────────────────────────

function NotificationBody({ n }: { n: AppNotification }) {
  const { message, orderRef, boldRef, errorRef } = n;
  const parts: React.ReactNode[] = [];
  let remaining = message;

  const marks: { text: string; node: (t: string, k: number) => React.ReactNode }[] = [];
  if (orderRef) marks.push({ text: orderRef, node: (t, k) => <Link key={k} href={`/orders/${t}`} className="font-semibold text-primary-light hover:underline" onClick={e => e.stopPropagation()}>{t}</Link> });
  if (boldRef)  marks.push({ text: boldRef,  node: (t, k) => <strong key={k} className="font-semibold text-text-primary">{t}</strong> });
  if (errorRef) marks.push({ text: errorRef, node: (t, k) => <span key={k} className="font-medium text-error">{t}</span> });

  let keyIdx = 0;
  marks.forEach(({ text, node }) => {
    const idx = remaining.indexOf(text);
    if (idx === -1) return;
    if (idx > 0) parts.push(remaining.slice(0, idx));
    parts.push(node(text, keyIdx++));
    remaining = remaining.slice(idx + text.length);
  });
  parts.push(remaining);

  return <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{parts}</p>;
}

// ── Pagination helpers ────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [page, setPage]   = useState(1);

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    setPage(1);
  }

  function markOneRead(id: string) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  const unreadCount = useMemo(() => items.filter(n => !n.isRead).length, [items]);

  const total      = items.length;
  const totalPages = Math.max(1, Math.ceil(total / NOTIFICATIONS.PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const from       = (safePage - 1) * NOTIFICATIONS.PAGE_SIZE + 1;
  const to         = Math.min(safePage * NOTIFICATIONS.PAGE_SIZE, total);
  const pageSlice  = items.slice(from - 1, to);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{NOTIFICATIONS.PAGE_HEADING}</h1>
          <p className="text-sm text-text-secondary mt-0.5">{NOTIFICATIONS.PAGE_SUBHEADING}</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors shrink-0"
          >
            <Bell className="w-4 h-4" />
            {NOTIFICATIONS.MARK_ALL_READ}
          </button>
        )}
      </div>

      {/* ── Empty state ── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
            <Bell className="w-7 h-7 text-text-muted" />
          </div>
          <p className="text-base font-semibold text-text-primary mb-1">{NOTIFICATIONS.EMPTY_HEADING}</p>
          <p className="text-sm text-text-secondary">{NOTIFICATIONS.EMPTY_BODY}</p>
        </div>
      ) : (
        <>
          {/* ── Desktop list — card with blue left accent ── */}
          <div className="hidden sm:block bg-surface rounded-xl border border-border shadow-sm overflow-hidden border-l-4 border-l-primary-light">
            <div className="divide-y divide-border">
              {pageSlice.map(n => (
                <button
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className={`w-full flex items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-elevated ${!n.isRead ? 'bg-primary-subtle/40' : ''}`}
                >
                  <NotificationIcon type={n.type} size="md" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-text-primary">{n.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-text-muted whitespace-nowrap">{n.timestamp}</span>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary-light" />}
                      </div>
                    </div>
                    <NotificationBody n={n} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Mobile list — left border per unread item ── */}
          <div className="sm:hidden bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {pageSlice.map(n => (
                <button
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-elevated border-l-[3px] border-solid ${!n.isRead ? 'border-l-primary-light bg-primary-subtle/20' : 'border-l-transparent'}`}
                >
                  <NotificationIcon type={n.type} size="sm" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-text-primary">{n.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-text-muted whitespace-nowrap">{n.timestamp}</span>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary-light" />}
                      </div>
                    </div>
                    <NotificationBody n={n} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Pagination ── */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-text-secondary shrink-0">
              {NOTIFICATIONS.SHOWING(from, to, total)}
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
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-text-muted">…</span>
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
        </>
      )}
    </div>
  );
}
