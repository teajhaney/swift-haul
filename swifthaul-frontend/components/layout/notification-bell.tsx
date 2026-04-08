"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import { NotificationIcon } from "@/components/notifications/notification-icon";
import { NOTIFICATION_BELL } from "@/constants/messages";
import { MOCK_NOTIFICATIONS } from "@/constants/notifications-mock";
import type { AppNotification } from "@/types/notification";

interface NotificationBellProps {
  count?: number;
  className?: string;
  iconClassName?: string;
}

export function NotificationBell({
  count = 0,
  className = "",
  iconClassName = "w-5 h-5",
}: NotificationBellProps) {
  const [open, setOpen]     = useState(false);
  const [items, setItems]   = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const containerRef         = useRef<HTMLDivElement>(null);

  const unread = items.filter(n => !n.isRead).length;
  const preview = items.slice(0, 5);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function markAllRead(e: React.MouseEvent) {
    e.stopPropagation();
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
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
                onClick={markAllRead}
                className="text-xs font-semibold text-primary-light hover:text-primary-hover transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Items */}
          <div className="divide-y divide-border max-h-[360px] overflow-y-auto">
            {preview.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-elevated ${!n.isRead ? 'bg-primary-subtle/30' : ''}`}
              >
                <NotificationIcon type={n.type} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-text-primary leading-snug">{n.title}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-text-muted whitespace-nowrap">{n.timestamp}</span>
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary-light" />}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                </div>
              </div>
            ))}
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
