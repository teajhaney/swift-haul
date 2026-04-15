'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { PAGE_META, TOPBAR } from '@/constants/navigation';
import { NotificationBell } from '@/components/layout/notification-bell';
import { Logo } from '@/components/shared/logo';
import { useLogout } from '@/hooks/auth/use-logout';

const PLACEHOLDER_USER = {
  name: 'Alex Reed',
  initials: 'AR',
  role: 'Admin',
  email: 'alex.reed@swifthaul.com',
};

export function Topbar() {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !userMenuRef.current?.contains(target) &&
        !mobileMenuRef.current?.contains(target)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Match longest prefix (handles /orders/new before /orders)
  const meta = PAGE_META[pathname] ??
    Object.entries(PAGE_META)
      .filter(([key]) => pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? {
      section: 'Main',
      title: 'Dashboard',
    };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center px-6 gap-4 shrink-0">
      {/* ── Mobile: Avatar | Logo | Icons ─────────────────── */}
      <div className="flex lg:hidden items-center justify-between w-full">
        <div ref={mobileMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(open => !open)}
            className="user-avatar w-8 h-8"
            aria-label={TOPBAR.USER_MENU_LABEL}
          >
            {PLACEHOLDER_USER.initials}
          </button>

          {userMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-surface rounded-xl border border-border shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout.mutate();
                }}
                disabled={logout.status === 'pending'}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {TOPBAR.LOG_OUT || 'Log Out'}
              </button>
            </div>
          )}
        </div>

        <Logo size={28} />

        <div className="flex items-center gap-1">
          <button className="icon-btn">
            <Search className="w-5 h-5" />
          </button>
          <NotificationBell
            iconClassName="w-5 h-5 text-text-secondary"
          />
        </div>
      </div>

      {/* ── Desktop: Breadcrumb + title | Search | User ───── */}
      <div className="hidden lg:flex items-center justify-between w-full gap-4">
        {/* Left: breadcrumb + title */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-0.5">
            <span>{meta.section}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary">{meta.title}</span>
          </div>
          <h1 className="text-xl font-bold text-primary leading-none truncate">
            {meta.title}
          </h1>
        </div>

        {/* Right: search + bell + user */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder={TOPBAR.SEARCH_PLACEHOLDER}
              className="topbar-search"
            />
          </div>

          {/* Notification bell */}
          <NotificationBell
            iconClassName="w-5 h-5 text-text-secondary"
          />

          {/* User menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-2 hover:bg-surface-elevated px-2 py-1.5 rounded-lg transition-colors"
              aria-label={TOPBAR.USER_MENU_LABEL}
            >
              <div className="user-avatar w-8 h-8">
                {PLACEHOLDER_USER.initials}
              </div>
              <span className="text-sm font-medium text-text-primary">
                {PLACEHOLDER_USER.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl border border-border shadow-xl z-50 overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-text-primary">
                    {PLACEHOLDER_USER.name}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {PLACEHOLDER_USER.email}
                  </p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white tracking-wide">
                    {PLACEHOLDER_USER.role}
                  </span>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors text-left"
                  >
                    <User className="w-4 h-4 shrink-0" />
                    My Profile
                  </button>
                  <button
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors text-left"
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    Settings
                  </button>
                </div>

                {/* Sign out */}
                <div className="border-t border-border py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout.mutate();
                    }}
                    disabled={logout.status === 'pending'}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {TOPBAR.LOG_OUT || 'Sign Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
