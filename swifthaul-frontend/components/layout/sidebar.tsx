"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { NAV_SECTIONS, SIDEBAR } from "@/constants/navigation";
import { LogoIcon } from "@/components/shared/logo";

/** Placeholder user — replaced by auth store once backend is wired. */
const PLACEHOLDER_USER = {
  name: "Alex Morgan",
  role: "ADMIN",
  initials: "AM",
};

function NavItem({
  label,
  href,
  icon: Icon,
  active,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link href={href} className={`nav-item ${active ? "nav-item-active" : ""}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="flex flex-col h-full bg-primary">

        {/* Brand */}
        <div className="px-5 pt-5 pb-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <LogoIcon size={32} />
            <div>
              <p className="text-white font-bold text-base leading-none tracking-tight">
                SwiftHaul
              </p>
              <p className="text-[10px] font-medium tracking-widest uppercase mt-0.5 text-slate-600">
                {SIDEBAR.BRAND_SUBTITLE}
              </p>
            </div>
          </Link>
        </div>

        {/* Create Order CTA */}
        <div className="px-4 pb-5">
          <Link
            href="/orders/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors bg-primary-light hover:bg-primary-hover"
          >
            <Plus className="w-4 h-4" />
            {SIDEBAR.CREATE_ORDER}
          </Link>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-slate-600">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <NavItem {...item} active={isActive(item.href)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 mt-auto border-t border-white/[0.08] flex items-center gap-3">
          {/* Avatar */}
          <div className="user-avatar w-9 h-9">
            {PLACEHOLDER_USER.initials}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {PLACEHOLDER_USER.name}
            </p>
            <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-accent text-white">
              {PLACEHOLDER_USER.role}
            </span>
          </div>

          {/* Logout */}
          <button
            className="p-1.5 rounded-md transition-colors shrink-0 text-slate-600 hover:text-white"
            aria-label={SIDEBAR.LOGOUT}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
