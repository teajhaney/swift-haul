// ─────────────────────────────────────────────────────────────────────────────
// order-form-mock.ts — Mock address suggestions and helpers for the order
// create form. Replace MOCK_ADDRESS_SUGGESTIONS with a backend geocode API
// call once the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

/** Simulated address pool — backend will call Nominatim via /geocode/search */
export const MOCK_ADDRESS_SUGGESTIONS: string[] = [
  '1420 5th Ave, Seattle, WA 98101',
  '400 Broad St, Seattle, WA 98109',
  '2000 6th Ave, Seattle, WA 98121',
  '700 Pike St, Seattle, WA 98101',
  '1101 Alaskan Way, Seattle, WA 98101',
  '800 Occidental Ave S, Seattle, WA 98134',
  '1200 12th Ave S, Seattle, WA 98144',
  '482 Oakwood Ave, Portland, OR 97201',
  '1200 Innovation Way, Seattle, WA 98101',
  '93 Pine St, Tacoma, WA 98402',
  '214 Harbor Rd, Everett, WA 98201',
  '57 Maple Dr, Bellevue, WA 98004',
  '889 Lakeview Blvd, Kirkland, WA 98033',
  '301 Cedar Lane, Redmond, WA 98052',
  '142 Elm St, Renton, WA 98057',
  '77 Birch Rd, Auburn, WA 98001',
  '500 Oak Ave, Kent, WA 98030',
  '23 West Pine St, Burien, WA 98166',
  '660 Spruce Way, Tukwila, WA 98188',
  '19 Aspen Ct, Des Moines, WA 98198',
  '45 Willow Ln, Federal Way, WA 98003',
  '88 Summit Dr, Shoreline, WA 98133',
  '312 Harbor View, Edmonds, WA 98020',
  '71 Creekside Rd, Bothell, WA 98021',
  '204 Pinecrest Ave, Lynnwood, WA 98036',
  '56 Ridgeline Blvd, Mukilteo, WA 98275',
  '900 Marine View Dr, Everett, WA 98201',
  '3500 188th St SW, Lynnwood, WA 98037',
  '1234 NE 8th St, Bellevue, WA 98005',
  '567 156th Ave NE, Redmond, WA 98052',
];

/** Simulates the network delay for a "create order" mutation */
export const MOCK_SUBMIT_DELAY_MS = 1200;

/** Generates a mock order ID in the SwiftHaul format */
export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand  = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `SH-${rand}`;
}
