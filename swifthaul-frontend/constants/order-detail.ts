// ─────────────────────────────────────────────────────────────────────────────
// order-detail.ts — All hardcoded strings for the order detail page
// ─────────────────────────────────────────────────────────────────────────────

import type { OrderStatus } from '@/types/order';

export const ORDER_DETAIL = {
  // Navigation
  BACK: 'Back to Orders',

  // Action buttons
  ACTION_EDIT:        'Edit Order',
  ACTION_CANCEL:      'Cancel Order',
  ACTION_RESCHEDULE:  'Reschedule',

  // Section headings
  SECTION_ORDER_INFO: 'Order Information',
  SECTION_MAP:        'Live Tracking',
  SECTION_TIMELINE:   'Status Timeline',
  SECTION_DRIVER:     'Assigned Driver',
  SECTION_POD:        'Proof of Delivery',
  SECTION_DETAILS:    'Details',

  // Order info labels
  LABEL_RECIPIENT:    'Recipient',
  LABEL_PHONE:        'Phone',
  LABEL_EMAIL:        'Email',
  LABEL_PICKUP:       'Pickup Address',
  LABEL_DELIVERY:     'Delivery Address',
  LABEL_WEIGHT:       'Weight',
  LABEL_DIMENSIONS:   'Dimensions',
  LABEL_DESCRIPTION:  'Description',
  LABEL_NOTES:        'Notes',
  LABEL_PRIORITY:     'Priority',
  LABEL_CREATED:      'Created',
  LABEL_EST_DELIVERY: 'Est. Delivery',

  // Driver section
  NO_DRIVER_HEADING: 'No driver assigned',
  NO_DRIVER_SUB:     'Assign a driver to begin processing this order.',
  ASSIGN_BTN:        'Assign Driver',
  REASSIGN_BTN:      'Reassign Driver',
  DRIVER_VEHICLE:    'Vehicle',
  DRIVER_PHONE:      'Phone',

  // Assign driver modal
  MODAL_TITLE:      'Assign Driver',
  MODAL_SUBTITLE:   'Select an available driver for this order',
  MODAL_SEARCH:     'Search by name or vehicle…',
  MODAL_CONFIRM:    'Confirm Assignment',
  MODAL_CANCEL:     'Cancel',
  MODAL_AVAILABLE:  'Available',
  MODAL_BUSY:       'Busy',
  MODAL_NO_RESULTS: 'No drivers match your search.',
  MODAL_NONE_SELECTED: 'Select a driver above to confirm.',

  // Map
  MAP_PICKUP_LABEL:   'Pickup',
  MAP_DELIVERY_LABEL: 'Delivery',
  MAP_PLACEHOLDER:    'Live GPS tracking is displayed here when a driver is en route.',

  // POD
  POD_SIGNED_BY: 'Signed by',
  POD_TIME:      'Signed at',
  POD_PHOTO:     'Delivery Photo',
  POD_NO_PHOTO:  'No photo captured for this delivery.',
  POD_NOTE:      'Note',

  // Timeline status labels
  TIMELINE_LABELS: {
    PENDING:          'Order Placed',
    ASSIGNED:         'Driver Assigned',
    ACCEPTED:         'Driver Accepted',
    PICKED_UP:        'Package Picked Up',
    IN_TRANSIT:       'In Transit',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED:        'Delivered',
    FAILED:           'Delivery Failed',
    RESCHEDULED:      'Rescheduled',
    CANCELLED:        'Cancelled',
  } satisfies Record<OrderStatus, string>,

  // Not found
  NOT_FOUND_HEADING: 'Order not found',
  NOT_FOUND_SUB:     'This order ID does not exist or may have been removed.',
  NOT_FOUND_BACK:    'Back to Orders',
} as const;
