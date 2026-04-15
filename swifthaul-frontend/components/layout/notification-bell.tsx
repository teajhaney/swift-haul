'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

import { NotificationIcon } from '@/components/notifications/notification-icon';
import { NOTIFICATION_BELL } from '@/constants/messages';
import { useNotifications } from '@/hooks/notifications/use-notifications';
import { useMarkAllRead } from '@/hooks/notifications/use-mark-all-read';
import { formatTimestamp } from '@/lib/utils';
import type { ApiNotification } from '@/types/notification';

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
}

export function NotificationBell({
  className = '',
  iconClassName = 'w-5 h-5',
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useNotifications({ limit: 5, page: 1 });
  const markAllRead = useMarkAllRead();

  const preview: ApiNotification[] = data?.data ?? [];
  const unread = data?.meta.unreadCount ?? 0;

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  function handleMarkAllRead(e: React.MouseEvent) {
    e.stopPropagation();
    markAllRead.mutate();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`icon-btn ${className}`}
        aria-label={
          unread > 0
            ? NOTIFICATION_BELL.ARIA_LABEL_UNREAD(unread)
            : NOTIFICATION_BELL.ARIA_LABEL_DEFAULT
        }
      >
        <Bell className={iconClassName} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-xl border border-border shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">Notifications</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent text-white leading-none">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
                className="text-xs font-semibold text-primary-light hover:text-primary-hover transition-colors disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Items */}
          <div className="divide-y divide-border max-h-[360px] overflow-y-auto">
            {preview.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Bell className="w-6 h-6 text-text-muted mb-2" />
                <p className="text-xs font-semibold text-text-secondary">All caught up!</p>
                <p className="text-xs text-text-muted mt-0.5">No new notifications.</p>
              </div>
            ) : (
              preview.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-elevated ${!n.isRead ? 'bg-primary-subtle/30' : ''}`}
                >
                  <NotificationIcon type={n.type} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-text-primary leading-snug">{n.title}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-text-muted whitespace-nowrap">
                          {formatTimestamp(n.createdAt)}
                        </span>
                        {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />}
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5 text-center">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-primary-light hover:text-primary-hover transition-colors"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
