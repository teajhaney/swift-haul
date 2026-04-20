// ─────────────────────────────────────────────────────────────────────────────
// constants/operations.ts — Strings for the Resolution Queue / Operations Page
// ─────────────────────────────────────────────────────────────────────────────

export const OPERATIONS = {
  HEADING: 'Resolution Queue',
  SUBHEADING: 'Manage and resolve orders with delivery exceptions, failures, or cancellations.',

  // Tabs
  TAB_FAILED: 'Failed Deliveries',
  TAB_CANCELLED: 'Cancelled',
  TAB_DELAYED: 'Delayed',

  // Table Headers
  COL_ORDER: 'Order ID',
  COL_REASON: 'Issue / Reason',
  COL_RECIPIENT: 'Recipient',
  COL_LAST_DRIVER: 'Last Driver',
  COL_TIME: 'Time',
  COL_ACTIONS: 'Resolution',

  // Actions
  ACTION_REASSIGN: 'Reassign',
  ACTION_VIEW: 'View Detail',
  ACTION_RESOLVE: 'Mark Resolved',

  // Empty States
  EMPTY_FAILED_TITLE: 'No failed deliveries',
  EMPTY_FAILED_SUB: 'All delivery exceptions have been cleared. Great job!',
  EMPTY_CANCELLED_TITLE: 'No cancelled orders',
  EMPTY_CANCELLED_SUB: 'Cancelled orders will appear here for review.',

  // Reason mapping (from Proof of Delivery)
  REASONS: {
    NOT_HOME: 'Recipient Not Home',
    WRONG_ADDRESS: 'Incorrect Address',
    REFUSED: 'Delivery Refused',
    OTHER: 'Other / Unknown',
  },

  FILTERS: {
    SEARCH_PLACEHOLDER: 'Search by ID or customer…',
    ALL_DRIVERS: 'All Drivers',
  },
} as const;
