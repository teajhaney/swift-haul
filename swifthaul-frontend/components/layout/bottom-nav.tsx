"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "@/constants/navigation";
import { useAuthStore } from "@/stores/auth.store";

export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const items = BOTTOM_NAV_ITEMS.filter((item) =>
    item.href === "/settings" ? user?.role === "ADMIN" : true
  );

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border h-16">
      <ul className="flex h-full">
        {items.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${active ? "text-primary-light" : "text-text-muted"}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold tracking-wide">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
