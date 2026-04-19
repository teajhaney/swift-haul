// ─────────────────────────────────────────────────────────────────────────────
// order-form.ts — All hardcoded strings and option data for the Create Order
// form. Priority icons live here as Lucide component refs.
// ─────────────────────────────────────────────────────────────────────────────

import { Clock, Zap, Rocket, type LucideIcon } from 'lucide-react';

export type FormPriority = 'STANDARD' | 'EXPRESS' | 'SAME_DAY';

// ── Page ─────────────────────────────────────────────────────────────────────

export const ORDER_FORM = {
  PAGE_HEADING: 'Create New Order',
  BREADCRUMB_ORDERS: 'Orders',
  BREADCRUMB_NEW: 'New Order',

  // Section headings
  SECTION_SENDER:    'Sender Information',
  SECTION_RECIPIENT: 'Recipient Information',
  SECTION_PACKAGE:   'Package Details',

  // Sender fields
  LABEL_SENDER_NAME:  'Sender Name',
  LABEL_SENDER_PHONE: 'Phone Number',
  LABEL_PICKUP:       'Pickup Address',
  PH_SENDER_NAME:     'Full name or Company',
  PH_SENDER_PHONE:    '+1 (555) 000-0000',
  PH_PICKUP:          'Start typing address…',

  // Recipient fields
  LABEL_RECIPIENT:       'Recipient Name',
  LABEL_RECIP_EMAIL:     'Email (Optional)',
  LABEL_RECIP_PHONE:     'Phone Number',
  LABEL_DELIVERY:        'Delivery Address',
  PH_RECIPIENT:          'Full name',
  PH_RECIP_EMAIL:        'recipient@example.com',
  PH_RECIP_PHONE:        '+1 (555) 000-0000',
  PH_DELIVERY:           'Enter destination address…',

  // Package fields
  LABEL_DESCRIPTION:     'Package Description',
  LABEL_WEIGHT:          'Weight (kg)',
  LABEL_PRIORITY:        'Delivery Priority',
  PH_DESCRIPTION:        'Fragile items, electronics, etc.',
  PH_WEIGHT:             '0.00',

  // Additional section
  LABEL_INSTRUCTIONS:    'Additional Instructions',
  LABEL_PICKUP_TIME:     'Scheduled Pickup Time',
  PH_INSTRUCTIONS:       'Gate codes, delivery notes, etc.',
  PICKUP_TIME_HINT:      'Leave blank for immediate dispatch',

  // Priority options
  PRIORITY_OPTIONS: [
    {
      value:       'STANDARD' as FormPriority,
      label:       'Standard',
      description: '3-5 Business Days',
      Icon:        Clock       as LucideIcon,
    },
    {
      value:       'EXPRESS' as FormPriority,
      label:       'Express',
      description: 'Next Day Delivery',
      Icon:        Zap         as LucideIcon,
    },
    {
      value:       'SAME_DAY' as FormPriority,
      label:       'Same Day',
      description: 'Within 6-12 Hours',
      Icon:        Rocket      as LucideIcon,
    },
  ] as const,

  // Right panel
  ROUTE_HEADING:       'Route Visualization',
  ROUTE_PREVIEW_BADGE: 'PREVIEW MODE',
  ROUTE_DISTANCE:      '12.4 km',
  ROUTE_DISTANCE_LABEL:'DISTANCE',
  ROUTE_TIME:          '24 mins',
  ROUTE_TIME_LABEL:    'EST. TIME',

  ESTIMATE_HEADING:    'Delivery Estimate',
  ESTIMATE_AMOUNT:     '$42.50',
  ESTIMATE_SUB:        'Includes priority express surcharge',
  ESTIMATE_REF_LABEL:  'REFERENCE ID',
  ESTIMATE_REF_VALUE:  'NEW-ORD-PREVIEW',

  DRIVERS_COUNT:       '8 Available Drivers Nearby',
  DRIVERS_SUB:         'System will auto-match upon creation',
  DRIVERS_LINK:        'View Map',

  // Form actions
  BTN_SUBMIT:  'Create Order',
  BTN_LOADING: 'Creating…',
  BTN_CANCEL:  'Cancel',

  // Validation messages
  ERR_SENDER_NAME:  'Sender name is required',
  ERR_SENDER_PHONE: 'Phone number is required',
  ERR_PICKUP:       'Pickup address is required',
  ERR_NAME:         'Recipient name is required',
  ERR_RECIP_PHONE:  'Phone number is required',
  ERR_DELIVERY:     'Delivery address is required',
  ERR_DESCRIPTION:  'Package description is required',
  ERR_WEIGHT:       'Weight is required',

  // Toast
  TOAST_SUCCESS: (id: string) => `Order ${id} created successfully`,
} as const;

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

export const MOCK_SUBMIT_DELAY_MS = 1200;
