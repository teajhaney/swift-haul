import type { DriverAvailabilityFilter } from '@/types/driver';

export const DRIVERS = {
  PAGE_HEADING: 'Drivers',
  PAGE_SUBHEADING: 'Active Fleet',
  SEARCH_PLACEHOLDER: 'Search drivers...',
  ADD_DRIVER_LABEL: 'Add Driver',

  // Table columns
  COL_DRIVER: 'Driver',
  COL_CONTACT_VEHICLE: 'Contact & Vehicle',
  COL_STATUS: 'Status',
  COL_CURRENT_LOAD: 'Current Load',
  COL_COMPLETED_TODAY: 'Completed Today',
  COL_AVG_TIME: 'Avg. Delivery Time',
  COL_ACTIONS: 'Actions',

  VIEW_PROFILE: 'View Profile',
  UNASSIGNED: 'Unassigned',
  SHIFT_ENDED: 'Shift Ended',
  IN_ACTIVE: 'Inactive',

  PAGE_SIZE: 10,

  SHOWING: (from: number, to: number, total: number) =>
    `Showing ${from}–${to} of ${total} drivers`,

  AVAILABILITY_OPTIONS: [
    { label: 'All Drivers', value: 'ALL' as DriverAvailabilityFilter },
    { label: 'Available', value: 'AVAILABLE' as DriverAvailabilityFilter },
    { label: 'Busy', value: 'BUSY' as DriverAvailabilityFilter },
    { label: 'Offline', value: 'OFFLINE' as DriverAvailabilityFilter },
  ],

  NO_RESULTS: 'No drivers found',
  NO_RESULTS_HINT: 'Try adjusting your search or filter.',
  CLEAR_FILTERS: 'Clear filters',

  // Error messages
  ACCESS_DENIED: 'Access Denied',
  ACCESS_DENIED_HINT: 'You don&apos;t have permission to view drivers',
  FAILED_TO_LOAD: 'Failed to load drivers',
  FAILED_TO_LOAD_HINT: 'Check your connection and try again',
} as const;
