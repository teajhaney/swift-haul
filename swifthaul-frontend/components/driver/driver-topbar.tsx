'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  LayoutList,
  Map,
  History,
  UserCircle2,
  ArrowLeft,
  Package,
  RefreshCw,
  Calendar,
  Settings,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import {
  MOCK_DRIVER_ALERTS,
  ALERT_TYPE_STYLES,
} from '@/constants/driver-alerts-mock';
import type { DriverAlertType } from '@/types/driver-pages';

interface DriverTopbarProps {
  /** If provided, mobile shows a back arrow + title instead of the brand */
  backHref?: string;
  title?: string;
}

const DESKTOP_NAV = [
  { label: 'Queue', href: '/driver/orders', icon: LayoutList },
  { label: 'Map View', href: '/driver/map', icon: Map },
  { label: 'Alerts', href: '/driver/alerts', icon: Bell },
  { label: 'History', href: '/driver/history', icon: History },
  { label: 'Profile', href: '/driver/profile', icon: UserCircle2 },
];

const TYPE_ICONS: Record<DriverAlertType, typeof Bell> = {
  ORDER_ASSIGNED: Package,
  ORDER_UPDATED: RefreshCw,
  SCHEDULE_CHANGE: Calendar,
  SYSTEM: Settings,
  URGENT: AlertTriangle,
};

export function DriverTopbar({ backHref, title }: DriverTopbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onAlerts = pathname === '/driver/alerts';

  const unread = MOCK_DRIVER_ALERTS.filter(a => !a.isRead).length;
  const preview = MOCK_DRIVER_ALERTS.slice(0, 4);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center gap-3 px-4 h-14">
        {/* ── Left: back button (mobile) or brand (desktop always) ── */}
        {backHref ? (
          <>
            <Link
              href={backHref}
              className="sm:hidden icon-btn -ml-1"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            {title && (
              <h1 className="sm:hidden text-base font-bold text-text-primary flex-1 truncate">
                {title}
              </h1>
            )}
            <Link
              href="/driver/orders"
              className="hidden sm:block text-lg font-bold text-text-primary shrink-0"
            >
              SwiftHaul
            </Link>
          </>
        ) : (
          <Link
            href="/driver/orders"
            className="text-lg font-bold text-text-primary shrink-0"
          >
            SwiftHaul
          </Link>
        )}

        {/* ── Center: desktop nav tabs ── */}
        <nav className="hidden sm:flex items-center gap-0.5 flex-1">
          {DESKTOP_NAV.map(({ label, href, icon: Icon }) => {
            const active =
              href === '/driver/orders'
                ? pathname === '/driver/orders' ||
                  pathname.startsWith('/driver/orders/')
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-subtle text-primary-light'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: name/badge (desktop) + bell + avatar ── */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="text-sm font-medium text-text-secondary">
              John Doe
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-subtle text-primary-light tracking-wide">
              DRIVER
            </span>
          </div>

          {/* Bell */}
          <div className="relative" ref={ref}>
            <button
              className="icon-btn relative"
              aria-label="Notifications"
              onClick={() => {
                if (!onAlerts) setOpen(o => !o);
              }}
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
              )}
            </button>

            {open && !onAlerts && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">
                      Alerts
                    </span>
                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/driver/alerts"
                    className="text-xs font-semibold text-primary-light hover:text-primary-hover transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    View all
                  </Link>
                </div>

                {/* Alert list */}
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {preview.map(alert => {
                    const style = ALERT_TYPE_STYLES[alert.type];
                    const Icon = TYPE_ICONS[alert.type];
                    return (
                      <Link
                        key={alert.id}
                        href="/driver/alerts"
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-surface-elevated transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.bg}`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${style.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-text-primary truncate">
                              {alert.title}
                            </p>
                            {!alert.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-light shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5 leading-relaxed">
                            {alert.message}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1">
                            {alert.time}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Footer */}
                <Link
                  href="/driver/alerts"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary-light hover:bg-surface-elevated transition-colors border-t border-border"
                >
                  See all alerts
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Avatar */}
          <Link
            href="/driver/profile"
            className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="text-xs font-bold text-white">JD</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
