'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutList, Map, Bell, History } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Queue',    icon: LayoutList, href: '/driver/orders'  },
  { label: 'Map View', icon: Map,        href: '/driver/map'     },
  { label: 'Alerts',   icon: Bell,       href: '/driver/alerts'  },
  { label: 'History',  icon: History,    href: '/driver/history' },
];

export function DriverBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border h-16">
      <ul className="flex h-full">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          // Queue tab: active on /driver/orders AND /driver/orders/[id]
          const isActive =
            href === '/driver/orders'
              ? pathname === '/driver/orders' || pathname.startsWith('/driver/orders/')
              : pathname === href;

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-1 h-full transition-colors ${
                  isActive ? 'text-primary-light' : 'text-text-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold tracking-wide uppercase">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
