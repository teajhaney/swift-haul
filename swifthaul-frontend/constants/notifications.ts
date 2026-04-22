export const NOTIFICATIONS = {
  PAGE_HEADING: 'Alert Center',
  PAGE_SUBHEADING: 'Manage your operational updates and system alerts.',
  MARK_ALL_READ: 'Mark all as read',
  PAGE_SIZE: 5,

  SHOWING: (from: number, to: number, total: number) =>
    `Showing ${from}–${to} of ${total} alerts`,

  EMPTY_HEADING: 'All caught up!',
  EMPTY_BODY: 'You have no new notifications.',

  // Notification type labels
  TITLE_ORDER_ASSIGNED:      'Order Assigned',
  TITLE_STATUS_CHANGED:      'Status Updated',
  TITLE_DELIVERY_COMPLETED:  'Delivery Completed',
  TITLE_DELIVERY_FAILED:     'Delivery Failed',
  TITLE_DRIVER_ONLINE:       'Driver Online',
  TITLE_DRIVER_OFFLINE:      'Driver Offline',
  TITLE_SYSTEM_MAINTENANCE:  'System Maintenance',
  TITLE_SYSTEM_UPDATE:       'System Update',
  TITLE_SHIPMENT_UPDATE:     'Shipment Update',
  TITLE_ROUTE_UPDATED:       'Route Updated',
} as const;
