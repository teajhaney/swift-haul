// ─────────────────────────────────────────────────────────────────────────────
// orders-mock.ts — Placeholder data for the orders list page.
// Replace with a TanStack Query hook once the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

import type { Order, Priority } from '@/types/order';

export const MOCK_ORDERS: Order[] = [
  { id: 'SH-8F3X9K2', status: 'IN_TRANSIT',       recipient: 'Sarah Jenkins',      destination: '482 Oakwood Ave, Portland, OR',        driver: 'Marcus Chen',      priority: 'HIGH',   date: 'Apr 7, 2026', time: '14:22' },
  { id: 'SH-409L2P5', status: 'DELIVERED',         recipient: 'TechCorp Solutions', destination: '1200 Innovation Way, Seattle, WA',      driver: 'Elena Rodriguez',  priority: 'NORMAL', date: 'Apr 7, 2026', time: '14:15' },
  { id: 'SH-1Z6Y4M8', status: 'FAILED',            recipient: 'David Miller',       destination: '93 Pine St, Tacoma, WA',               driver: 'James Wilson',     priority: 'HIGH',   date: 'Apr 7, 2026', time: '13:58' },
  { id: 'SH-9T4V2X8', status: 'PENDING',           recipient: 'Alice Green',        destination: '214 Harbor Rd, Everett, WA',           driver: null,               priority: 'LOW',    date: 'Apr 7, 2026', time: '13:45' },
  { id: 'SH-2K8M4N1', status: 'ASSIGNED',          recipient: 'Robert Hayes',       destination: '57 Maple Dr, Bellevue, WA',            driver: 'Priya Sharma',     priority: 'NORMAL', date: 'Apr 7, 2026', time: '13:30' },
  { id: 'SH-7P5Q3R6', status: 'OUT_FOR_DELIVERY',  recipient: 'Linda Torres',       destination: '889 Lakeview Blvd, Kirkland, WA',      driver: 'Tom Nguyen',       priority: 'HIGH',   date: 'Apr 7, 2026', time: '13:10' },
  { id: 'SH-3C2L9W7', status: 'PICKED_UP',         recipient: 'James Hartwell',     destination: '301 Cedar Lane, Redmond, WA',          driver: 'Aisha Okonkwo',    priority: 'NORMAL', date: 'Apr 7, 2026', time: '12:55' },
  { id: 'SH-6V1B8D4', status: 'DELIVERED',         recipient: 'Marta Kowalski',     destination: '142 Elm St, Renton, WA',               driver: 'Carlos Mendez',    priority: 'LOW',    date: 'Apr 6, 2026', time: '18:42' },
  { id: 'SH-4H7T6E9', status: 'RESCHEDULED',       recipient: 'Nathan Brooks',      destination: '77 Birch Rd, Auburn, WA',              driver: 'Elena Rodriguez',  priority: 'NORMAL', date: 'Apr 6, 2026', time: '17:20' },
  { id: 'SH-5X9R2Y3', status: 'CANCELLED',         recipient: 'Olivia Grant',       destination: '500 Oak Ave, Kent, WA',                driver: null,               priority: 'LOW',    date: 'Apr 6, 2026', time: '16:55' },
  { id: 'SH-0M4K1J8', status: 'IN_TRANSIT',        recipient: 'Kai Yamamoto',       destination: '23 West Pine St, Burien, WA',          driver: 'Marcus Chen',      priority: 'HIGH',   date: 'Apr 6, 2026', time: '15:30' },
  { id: 'SH-2W8S5F1', status: 'DELIVERED',         recipient: 'Grace Lee',          destination: '660 Spruce Way, Tukwila, WA',          driver: 'Tom Nguyen',       priority: 'NORMAL', date: 'Apr 6, 2026', time: '14:48' },
  { id: 'SH-9N3X7G2', status: 'PENDING',           recipient: 'Darius Johnson',     destination: '19 Aspen Ct, Des Moines, WA',          driver: null,               priority: 'HIGH',   date: 'Apr 6, 2026', time: '14:10' },
  { id: 'SH-7L6D2C5', status: 'ACCEPTED',          recipient: 'Sofia Bianchi',      destination: '45 Willow Ln, Federal Way, WA',        driver: 'James Wilson',     priority: 'NORMAL', date: 'Apr 6, 2026', time: '13:55' },
  { id: 'SH-1R4T8V0', status: 'FAILED',            recipient: 'Ethan Park',         destination: '88 Summit Dr, Shoreline, WA',          driver: 'Carlos Mendez',    priority: 'HIGH',   date: 'Apr 6, 2026', time: '12:30' },
  { id: 'SH-5A3B9C4', status: 'IN_TRANSIT',        recipient: 'Amara Diallo',       destination: '312 Harbor View, Edmonds, WA',         driver: 'Priya Sharma',     priority: 'NORMAL', date: 'Apr 5, 2026', time: '16:20' },
  { id: 'SH-8D7E2F1', status: 'DELIVERED',         recipient: 'Brendan Walsh',      destination: '71 Creekside Rd, Bothell, WA',         driver: 'Aisha Okonkwo',    priority: 'LOW',    date: 'Apr 5, 2026', time: '15:05' },
  { id: 'SH-6G5H4I3', status: 'OUT_FOR_DELIVERY',  recipient: 'Yuki Tanaka',        destination: '204 Pinecrest Ave, Lynnwood, WA',      driver: 'Tom Nguyen',       priority: 'NORMAL', date: 'Apr 5, 2026', time: '14:40' },
  { id: 'SH-3J2K1L9', status: 'PENDING',           recipient: 'Marcus Webb',        destination: '56 Ridgeline Blvd, Mukilteo, WA',      driver: null,               priority: 'LOW',    date: 'Apr 5, 2026', time: '13:25' },
  { id: 'SH-0N8M7O6', status: 'ASSIGNED',          recipient: 'Isabelle Fontaine',  destination: '900 Marine View Dr, Everett, WA',      driver: 'Marcus Chen',      priority: 'HIGH',   date: 'Apr 5, 2026', time: '12:00' },
];

export const PRIORITY_STYLES: Record<Priority, string> = {
  HIGH:   'bg-red-100 text-red-700',
  NORMAL: 'bg-gray-100 text-gray-600',
  LOW:    'bg-slate-50 text-slate-500',
};
