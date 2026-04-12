// orders.ts — All hardcoded strings for the orders list page

import type { Priority } from '@/types/order';

export const ORDERS = {
  // Page header
  PAGE_HEADING:    'Orders',
  PAGE_SUBHEADING: 'Manage and track all deliveries',
  NEW_ORDER_BTN:   'New Order',

  // Search & toolbar
  SEARCH_PLACEHOLDER: 'Search by ID, recipient, or destination…',
  EXPORT_BTN:         'Export CSV',
  FILTER_BTN:         'Filters',

  // Status filter tabs
  STATUS_TABS: [
    { label: 'All',              value: 'ALL'              },
    { label: 'Pending',          value: 'PENDING'          },
    { label: 'In Transit',       value: 'IN_TRANSIT'       },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered',        value: 'DELIVERED'        },
    { label: 'Failed',           value: 'FAILED'           },
    { label: 'Cancelled',        value: 'CANCELLED'        },
  ] as const,

  // Priority filter options
  PRIORITY_OPTIONS: [
    { label: 'All Priorities', value: 'ALL'      },
    { label: 'Standard',       value: 'STANDARD' },
    { label: 'Express',        value: 'EXPRESS'  },
    { label: 'Same Day',       value: 'SAME_DAY' },
  ] as const,

  // Table columns
  COL_ID:          'Order ID',
  COL_STATUS:      'Status',
  COL_RECIPIENT:   'Recipient',
  COL_DESTINATION: 'Destination',
  COL_DRIVER:      'Driver',
  COL_PRIORITY:    'Priority',
  COL_DATE:        'Date & Time',

  // Row states
  UNASSIGNED:    'Unassigned',
  DRIVER_LABEL:  'Driver',

  // Empty state
  NO_RESULTS:      'No orders found',
  NO_RESULTS_HINT: 'Try adjusting your search or filter criteria.',
  CLEAR_FILTERS:   'Clear filters',

  // Pagination
  PAGE_SIZE: 10,
  SHOWING: (from: number, to: number, total: number) =>
    `Showing ${from}–${to} of ${total} orders`,
} as const;

// Human-readable labels for Priority enum values — use these in the UI, never display the raw enum.
export const PRIORITY_LABELS: Record<Priority, string> = {
  STANDARD: 'Standard',
  EXPRESS:  'Express',
  SAME_DAY: 'Same Day',
};

// Badge styles for each priority level.
export const PRIORITY_STYLES: Record<Priority, string> = {
  STANDARD: 'bg-gray-100 text-gray-600',
  EXPRESS:  'bg-blue-100 text-blue-700',
  SAME_DAY: 'bg-orange-100 text-orange-700',
};
