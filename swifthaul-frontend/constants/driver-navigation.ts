import { LayoutList, Map, Bell, History, UserCircle2, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DRIVER_QUEUE } from '@/constants/driver-queue';

export type DriverNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

/** 5-tab desktop header nav used across all driver pages */
export const DRIVER_DESKTOP_NAV: DriverNavItem[] = [
  { label: 'Queue',    href: '/driver/orders',  icon: LayoutList  },
  { label: 'Map View', href: '/driver/map',     icon: Map         },
  { label: 'Alerts',   href: '/driver/alerts',  icon: Bell        },
  { label: 'History',  href: '/driver/history', icon: History     },
  { label: 'Profile',  href: '/driver/profile', icon: UserCircle2 },
];

/** 3-tab bottom nav shown on the order detail page (mobile) */
export const DRIVER_DETAIL_NAV: DriverNavItem[] = [
  { label: DRIVER_QUEUE.NAV_ROUTES,  icon: LayoutList,  href: '/driver/orders' },
  { label: DRIVER_QUEUE.NAV_ACTIVE,  icon: Truck,       href: '/driver/orders' },
  { label: DRIVER_QUEUE.NAV_PROFILE, icon: UserCircle2, href: '/driver/profile' },
];
