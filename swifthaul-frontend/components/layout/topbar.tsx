"use client";

import { usePathname } from "next/navigation";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { PAGE_META, TOPBAR } from "@/constants/navigation";
import { NotificationBell } from "@/components/layout/notification-bell";
import { Logo } from "@/components/shared/logo";

const PLACEHOLDER_USER = {
  name: "Alex Reed",
  initials: "AR",
};

export function Topbar() {
  const pathname = usePathname();

  // Match longest prefix (handles /orders/new before /orders)
  const meta =
    PAGE_META[pathname] ??
    Object.entries(PAGE_META)
      .filter(([key]) => pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ??
    { section: "Main", title: "Dashboard" };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center px-6 gap-4 shrink-0">

      {/* ── Mobile: Avatar | Logo | Icons ─────────────────── */}
      <div className="flex lg:hidden items-center justify-between w-full">
        <div className="user-avatar w-8 h-8">
          {PLACEHOLDER_USER.initials}
        </div>

        <Logo size={28} />

        <div className="flex items-center gap-1">
          <button className="icon-btn">
            <Search className="w-5 h-5" />
          </button>
          <NotificationBell count={3} iconClassName="w-5 h-5 text-text-secondary" />
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
          <NotificationBell count={3} iconClassName="w-5 h-5 text-text-secondary" />

          {/* User menu */}
          <button
            className="flex items-center gap-2 hover:bg-surface-elevated px-2 py-1.5 rounded-lg transition-colors"
            aria-label={TOPBAR.USER_MENU_LABEL}
          >
            <div className="user-avatar w-8 h-8">
              {PLACEHOLDER_USER.initials}
            </div>
            <span className="text-sm font-medium text-text-primary">{PLACEHOLDER_USER.name}</span>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
