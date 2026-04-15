// ─────────────────────────────────────────────────────────────────────────────
// dashboard.ts — All hardcoded strings for the analytics dashboard page
// ─────────────────────────────────────────────────────────────────────────────

export const DASHBOARD = {
  // Page header
  MOBILE_HEADING: 'Operations Analytics',
  MOBILE_SUBHEADING: 'Live fleet performance overview',

  // Time range filter
  TIME_RANGES: [
    { label: '7d',     value: '7d'     },
    { label: '30d',    value: '30d'    },
    { label: '90d',    value: '90d'    },
    { label: 'Custom', value: 'custom' },
  ],

  // KPI cards
  KPI_DELIVERIES_LABEL: 'Total Deliveries Today',
  KPI_SUCCESS_LABEL:    'Success Rate',
  KPI_ACTIVE_LABEL:     'Active Orders',
  KPI_DRIVERS_LABEL:    'Active Drivers',

  // Deliveries chart
  CHART_HEADING:    'Deliveries This Week',
  CHART_SUBHEADING: 'Volume tracking across primary regions',
  CHART_LINE_THIS:  'Total Orders',
  CHART_LINE_LAST:  'Last Week',

  // Status donut
  DONUT_HEADING:    'Status Breakdown',
  DONUT_SUBHEADING: 'Real-time order lifecycle distribution',
  DONUT_CENTER_LABEL: 'ORDERS',

  // Recent orders
  RECENT_ORDERS_HEADING: 'Recent Orders',
  RECENT_ORDERS_VIEW_ALL: 'View All',
  RECENT_ORDERS_EXPORT:   'Export CSV',
  RECENT_ORDERS_FILTER:   'Filter',

  // Table columns
  COL_TRACKING_ID:  'Tracking ID',
  COL_STATUS:       'Status',
  COL_RECIPIENT:    'Recipient',
  COL_DESTINATION:  'Destination',
  COL_DRIVER:       'Driver',
  COL_PRIORITY:     'Priority',
  COL_TIME:         'Time',

  // Footer
  SHOWING_ORDERS: (shown: number, total: number) =>
    `Showing ${shown} of ${total} active orders`,

  // Unassigned driver
  UNASSIGNED: 'Unassigned',
} as const;
