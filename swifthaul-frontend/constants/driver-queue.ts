import type { DriverOrderStatus } from '@/types/driver-order';

export const DRIVER_QUEUE = {
  BRAND: 'SwiftHaul',
  DRIVER_ROLE_BADGE: 'DRIVER',

  // Queue page
  ACTIVE_DELIVERY_HEADING: 'Active Delivery',
  ONLINE_STATUS: 'Online',
  VIEW_DETAILS: 'View Details →',
  EST_DELIVERY_PREFIX: 'Est. Delivery:',

  UPCOMING_HEADING: 'Upcoming Deliveries',
  UPCOMING_QUEUE_HEADING: 'Upcoming Queue',
  VIEW_SCHEDULE: 'View Schedule',
  ACCEPT_MORE: 'Accept More Orders',

  MARK_DELIVERED: 'Mark Delivered',
  NO_ACTIVE: 'No active delivery',
  NO_ACTIVE_HINT: 'You have no order in progress right now.',

  // Bottom nav (queue page)
  NAV_QUEUE:    'Queue',
  NAV_MAP:      'Map View',
  NAV_ALERTS:   'Alerts',
  NAV_HISTORY:  'History',

  // Detail page
  DETAIL_HEADING: 'Delivery Detail',
  RECIPIENT_LABEL: 'Recipient',
  SENDER_LABEL: 'Sender / Pickup',
  PACKAGE_LABEL: 'Package Description',
  TIMELINE_HEADING: 'Delivery Timeline',

  STATUS_MARK_DELIVERED:     'Mark Out for Delivery',
  STATUS_MARK_FAILED:        'Mark as Failed',
  STATUS_OUT_FOR_DELIVERY:   'Mark Delivered',
  STATUS_ACCEPTED:           'Mark Picked Up',
  STATUS_ASSIGNED:           'Accept Order',

  // Bottom nav (detail page)
  NAV_ROUTES: 'My Routes',
  NAV_ACTIVE: 'Active Order',
  NAV_PROFILE: 'Profile',

  MILES_SUFFIX: 'miles to destination',
  KG_SUFFIX: 'kg',
  MI_SUFFIX: 'mi',
} as const;

export const QUEUE_PAGE_SIZE = 5;

/** CTA button config for each driver order status on the detail page */
export const CTA_CONFIG: Record<DriverOrderStatus, { label: string; color: string } | null> = {
  ASSIGNED:         null,
  ACCEPTED:         { label: DRIVER_QUEUE.STATUS_ACCEPTED,         color: 'bg-warning hover:bg-amber-600'        },
  PICKED_UP:        { label: DRIVER_QUEUE.STATUS_MARK_DELIVERED,   color: 'bg-purple-600 hover:bg-purple-700'    },
  IN_TRANSIT:       { label: DRIVER_QUEUE.STATUS_MARK_DELIVERED,   color: 'bg-purple-600 hover:bg-purple-700'    },
  OUT_FOR_DELIVERY: { label: DRIVER_QUEUE.STATUS_OUT_FOR_DELIVERY,  color: 'bg-success hover:bg-emerald-600'     },
  DELIVERED:        null,
  FAILED:           null,
  PENDING:          null,
};
