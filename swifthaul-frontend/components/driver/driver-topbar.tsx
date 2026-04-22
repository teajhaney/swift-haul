'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowLeft, ChevronRight } from 'lucide-react';
import { ALERT_TYPE_ICONS, ALERT_TYPE_STYLES } from '@/constants/driver-alerts';
import { DRIVER_DESKTOP_NAV } from '@/constants/driver-navigation';
import { useAuthStore } from '@/stores/auth.store';
import { getInitials } from '@/lib/utils';
import { NotificationBell } from '@/components/layout/notification-bell';

interface DriverTopbarProps {
  /** If provided, mobile shows a back arrow + title instead of the brand */
  backHref?: string;
  title?: string;
}

export function DriverTopbar({ backHref, title }: DriverTopbarProps) {
  const pathname = usePathname();
  const user = useAuthStore(s => s.user);
  const userInitials = user ? getInitials(user.name) : 'DR';

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
          {DRIVER_DESKTOP_NAV.map(({ label, href, icon: Icon }) => {
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
              {user?.name ?? 'Driver'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-subtle text-primary-light tracking-wide">
              {user?.role ?? 'DRIVER'}
            </span>
          </div>

          {/* Bell */}
          <NotificationBell />

          {/* Avatar */}
          <Link
            href="/driver/profile"
            aria-label="View profile"
            className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="text-xs font-bold text-white">{userInitials}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
