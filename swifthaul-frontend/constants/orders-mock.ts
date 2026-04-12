// orders-mock.ts — Placeholder data for the orders list page.
// Replace with a TanStack Query hook once the backend is ready.

import type { Order } from '@/types/order';

export const MOCK_ORDERS: Order[] = [
  { referenceId: 'SH-8F3X9K2', status: 'IN_TRANSIT',       recipient: 'Sarah Jenkins',      destination: '482 Oakwood Ave, Portland, OR',        driver: 'Marcus Chen',      priority: 'EXPRESS',   date: 'Apr 7, 2026', time: '14:22' },
  { referenceId: 'SH-409L2P5', status: 'DELIVERED',         recipient: 'TechCorp Solutions', destination: '1200 Innovation Way, Seattle, WA',      driver: 'Elena Rodriguez',  priority: 'STANDARD',  date: 'Apr 7, 2026', time: '14:15' },
  { referenceId: 'SH-1Z6Y4M8', status: 'FAILED',            recipient: 'David Miller',       destination: '93 Pine St, Tacoma, WA',               driver: 'James Wilson',     priority: 'SAME_DAY',  date: 'Apr 7, 2026', time: '13:58' },
  { referenceId: 'SH-9T4V2X8', status: 'PENDING',           recipient: 'Alice Green',        destination: '214 Harbor Rd, Everett, WA',           driver: null,               priority: 'STANDARD',  date: 'Apr 7, 2026', time: '13:45' },
  { referenceId: 'SH-2K8M4N1', status: 'ASSIGNED',          recipient: 'Robert Hayes',       destination: '57 Maple Dr, Bellevue, WA',            driver: 'Priya Sharma',     priority: 'STANDARD',  date: 'Apr 7, 2026', time: '13:30' },
  { referenceId: 'SH-7P5Q3R6', status: 'OUT_FOR_DELIVERY',  recipient: 'Linda Torres',       destination: '889 Lakeview Blvd, Kirkland, WA',      driver: 'Tom Nguyen',       priority: 'SAME_DAY',  date: 'Apr 7, 2026', time: '13:10' },
  { referenceId: 'SH-3C2L9W7', status: 'PICKED_UP',         recipient: 'James Hartwell',     destination: '301 Cedar Lane, Redmond, WA',          driver: 'Aisha Okonkwo',    priority: 'STANDARD',  date: 'Apr 7, 2026', time: '12:55' },
  { referenceId: 'SH-6V1B8D4', status: 'DELIVERED',         recipient: 'Marta Kowalski',     destination: '142 Elm St, Renton, WA',               driver: 'Carlos Mendez',    priority: 'STANDARD',  date: 'Apr 6, 2026', time: '18:42' },
  { referenceId: 'SH-4H7T6E9', status: 'RESCHEDULED',       recipient: 'Nathan Brooks',      destination: '77 Birch Rd, Auburn, WA',              driver: 'Elena Rodriguez',  priority: 'STANDARD',  date: 'Apr 6, 2026', time: '17:20' },
  { referenceId: 'SH-5X9R2Y3', status: 'CANCELLED',         recipient: 'Olivia Grant',       destination: '500 Oak Ave, Kent, WA',                driver: null,               priority: 'STANDARD',  date: 'Apr 6, 2026', time: '16:55' },
  { referenceId: 'SH-0M4K1J8', status: 'IN_TRANSIT',        recipient: 'Kai Yamamoto',       destination: '23 West Pine St, Burien, WA',          driver: 'Marcus Chen',      priority: 'EXPRESS',   date: 'Apr 6, 2026', time: '15:30' },
  { referenceId: 'SH-2W8S5F1', status: 'DELIVERED',         recipient: 'Grace Lee',          destination: '660 Spruce Way, Tukwila, WA',          driver: 'Tom Nguyen',       priority: 'STANDARD',  date: 'Apr 6, 2026', time: '14:48' },
  { referenceId: 'SH-9N3X7G2', status: 'PENDING',           recipient: 'Darius Johnson',     destination: '19 Aspen Ct, Des Moines, WA',          driver: null,               priority: 'SAME_DAY',  date: 'Apr 6, 2026', time: '14:10' },
  { referenceId: 'SH-7L6D2C5', status: 'ACCEPTED',          recipient: 'Sofia Bianchi',      destination: '45 Willow Ln, Federal Way, WA',        driver: 'James Wilson',     priority: 'STANDARD',  date: 'Apr 6, 2026', time: '13:55' },
  { referenceId: 'SH-1R4T8V0', status: 'FAILED',            recipient: 'Ethan Park',         destination: '88 Summit Dr, Shoreline, WA',          driver: 'Carlos Mendez',    priority: 'EXPRESS',   date: 'Apr 6, 2026', time: '12:30' },
  { referenceId: 'SH-5A3B9C4', status: 'IN_TRANSIT',        recipient: 'Amara Diallo',       destination: '312 Harbor View, Edmonds, WA',         driver: 'Priya Sharma',     priority: 'STANDARD',  date: 'Apr 5, 2026', time: '16:20' },
  { referenceId: 'SH-8D7E2F1', status: 'DELIVERED',         recipient: 'Brendan Walsh',      destination: '71 Creekside Rd, Bothell, WA',         driver: 'Aisha Okonkwo',    priority: 'STANDARD',  date: 'Apr 5, 2026', time: '15:05' },
  { referenceId: 'SH-6G5H4I3', status: 'OUT_FOR_DELIVERY',  recipient: 'Yuki Tanaka',        destination: '204 Pinecrest Ave, Lynnwood, WA',      driver: 'Tom Nguyen',       priority: 'STANDARD',  date: 'Apr 5, 2026', time: '14:40' },
  { referenceId: 'SH-3J2K1L9', status: 'PENDING',           recipient: 'Marcus Webb',        destination: '56 Ridgeline Blvd, Mukilteo, WA',      driver: null,               priority: 'STANDARD',  date: 'Apr 5, 2026', time: '13:25' },
  { referenceId: 'SH-0N8M7O6', status: 'ASSIGNED',          recipient: 'Isabelle Fontaine',  destination: '900 Marine View Dr, Everett, WA',      driver: 'Marcus Chen',      priority: 'EXPRESS',   date: 'Apr 5, 2026', time: '12:00' },
];
