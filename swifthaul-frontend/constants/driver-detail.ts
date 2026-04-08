export const DRIVER_DETAIL = {
  BREADCRUMB_PARENT: 'Drivers',
  EDIT_PROFILE: 'Edit Profile',
  DRIVER_ROLE_BADGE: 'DRIVER',

  // Stat cards
  STAT_TOTAL_DELIVERIES: 'Total Deliveries',
  STAT_SUCCESS_RATE: 'Success Rate',
  STAT_FAILED_DELIVERIES: 'Failed Deliveries',
  STAT_AVG_TIME: 'Avg Delivery Time',
  FAILED_REASON_PREFIX: 'Reason:',
  TOP_PERFORMER: 'Top 10% performance',

  // Delivery history
  HISTORY_HEADING: 'Delivery History',
  HISTORY_EXPORT: 'Export CSV',
  COL_TRACKING_ID: 'Tracking ID',
  COL_STATUS: 'Status',
  COL_RECIPIENT: 'Recipient',
  COL_COMPLETED_AT: 'Completed At',

  HISTORY_SHOWING: (from: number, to: number, total: number) =>
    `Showing ${from} to ${to} of ${total} results`,
  HISTORY_PAGE_SIZE: 4,

  // Right panel
  ASSIGNMENTS_HEADING: 'Current Assignments',
  ASSIGN_NEW_ORDER: '+ Assign New Order',
  VIEW_ORDER: 'View Order',
  ETA_PREFIX: 'ETA:',

  ACTIVITY_HEADING: "Today's Activity",
  VIEW_FULL_LOG: 'View Full Activity Log →',

  NOT_FOUND: 'Driver not found',
  NOT_FOUND_HINT: 'This driver does not exist or has been removed.',
  BACK_TO_DRIVERS: '← Back to Drivers',
} as const;
