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

export const AVAILABILITY_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
  AVAILABLE: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
    label: 'Available',
  },
  BUSY: {
    dot: 'bg-warning',
    badge: 'bg-warning/10 text-warning',
    label: 'Busy',
  },
  OFFLINE: {
    dot: 'bg-border-strong',
    badge: 'bg-surface-elevated text-text-muted',
    label: 'Offline',
  },
};

export const DRIVER_AVAILABILITY_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'BUSY',      label: 'Busy'      },
  { value: 'OFFLINE',   label: 'Offline'   },
] as const;

export const AVAILABILITY_TOGGLE_STYLES: Record<string, { active: string; dot: string }> = {
  AVAILABLE: { active: 'bg-success text-white border-success',        dot: 'bg-success'    },
  BUSY:      { active: 'bg-warning text-white border-warning',        dot: 'bg-warning'    },
  OFFLINE:   { active: 'bg-text-muted text-white border-text-muted',  dot: 'bg-text-muted' },
};
