export const TRACKING = {
  BRAND: 'SwiftHaul',
  TITLE: 'Track Your Delivery',
  LIVE: 'LIVE',
  LIVE_TRACKING: 'LIVE TRACKING',
  POWERED_BY: 'POWERED BY SWIFTHAUL',

  // Labels
  TRACKING_ID_LABEL: 'TRACKING ID',
  RECIPIENT_LABEL:   'RECIPIENT',
  ADDRESS_LABEL:     'DELIVERY ADDRESS',
  DESCRIPTION_LABEL: 'DESCRIPTION',
  DRIVER_LABEL:      'YOUR DRIVER',
  TIMELINE_HEADING:  'DELIVERY TIMELINE',
  DETAILS_HEADING:   'Delivery Details',
  HISTORY_HEADING:   'Tracking History',

  // Map
  MAP_ATTRIBUTION:  'Leaflet.js Data',
  CENTER_MAP:       'CENTER MAP',
  EST_ARRIVAL:      'ESTIMATED ARRIVAL',

  // Footer
  FOOTER_PRIVACY: 'PRIVACY POLICY',
  FOOTER_TERMS:   'TERMS OF SERVICE',
  FOOTER_HELP:    'HELP CENTER',
  HELP_CENTER:    'Help Center',
  TERMS:          'Terms',

  // Stepper
  DESKTOP_STEPS: ['Pending', 'Assigned', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'] as string[],
  MOBILE_STEPS:  ['Order', 'Pickup', 'Transit', 'Arrived'] as string[],
} as const;

/** Maps order status to 0-based desktop step index (6-step stepper) */
export const STATUS_STEP_MAP: Record<string, number> = {
  PENDING:          0,
  ASSIGNED:         1,
  ACCEPTED:         1,
  PICKED_UP:        2,
  IN_TRANSIT:       3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED:        5,
};

/** Maps order status to 0-based mobile step index (4-step stepper) */
export const MOBILE_STATUS_STEP_MAP: Record<string, number> = {
  PENDING:          0,
  ASSIGNED:         0,
  ACCEPTED:         0,
  PICKED_UP:        1,
  IN_TRANSIT:       2,
  OUT_FOR_DELIVERY: 2,
  DELIVERED:        3,
};

export const TRACKING_STATUS_COLORS: Record<string, string> = {
  PENDING:          'bg-gray-100 text-gray-600',
  ASSIGNED:         'bg-blue-100 text-blue-700',
  ACCEPTED:         'bg-blue-100 text-blue-700',
  PICKED_UP:        'bg-amber-100 text-amber-700',
  IN_TRANSIT:       'bg-cyan-100 text-cyan-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED:        'bg-green-100 text-green-700',
  FAILED:           'bg-red-100 text-red-700',
};
