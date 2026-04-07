import {
  LayoutDashboard,
  Package,
  Truck,
  Bell,
  Settings,
} from "lucide-react";
import type { NavItem, NavSection, PageMeta } from "@/types/navigation";

// ── Sidebar nav sections ──────────────────────────────────────

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
      { label: "Orders",        href: "/orders",        icon: Package },
      { label: "Drivers",       href: "/drivers",       icon: Truck },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { label: "Settings",      href: "/settings",      icon: Settings },
    ],
  },
];

// ── Mobile bottom tab bar ─────────────────────────────────────

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard",     icon: LayoutDashboard },
  { label: "Orders",    href: "/orders",        icon: Package },
  { label: "Drivers",   href: "/drivers",       icon: Truck },
  { label: "Alerts",    href: "/notifications", icon: Bell },
  { label: "Settings",  href: "/settings",      icon: Settings },
];

// ── Page title / breadcrumb map ───────────────────────────────

export const PAGE_META: Record<string, PageMeta> = {
  "/dashboard":      { section: "Main",          title: "Dashboard" },
  "/orders":         { section: "Main",          title: "Orders" },
  "/orders/new":     { section: "Orders",        title: "New Order" },
  "/drivers":        { section: "Main",          title: "Drivers" },
  "/notifications":  { section: "Communication", title: "Notifications" },
  "/settings":       { section: "Admin",         title: "Settings" },
};

// ── Sidebar labels ────────────────────────────────────────────

export const SIDEBAR = {
  BRAND_SUBTITLE: "OPERATIONS CONTROL",
  CREATE_ORDER:   "+ Create Order",
  LOGOUT:         "Logout",
} as const;

// ── Topbar labels ─────────────────────────────────────────────

export const TOPBAR = {
  SEARCH_PLACEHOLDER: "Search orders, drivers...",
  USER_MENU_LABEL:    "Open user menu",
} as const;
