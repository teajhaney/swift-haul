import type { UserRole } from '@/types/settings';

export const SETTINGS = {
  PAGE_HEADING:    'Settings',
  BREADCRUMB:      'Admin > Settings',

  TEAM_HEADING:    'Team Members',
  TEAM_SUBHEADING: "Manage your organization's users, roles, and platform permissions.",

  INVITE_BTN: 'Invite User',

  // Table
  COL_NAME_ROLE:  'Name & Role',
  COL_EMAIL:      'Email',
  COL_STATUS:     'Status',
  COL_JOINED:     'Joined Date',
  COL_ACTIONS:    'Actions',

  YOU_BADGE:     'YOU',
  ACTIVE_LABEL:  'ACTIVE',
  INVITED_LABEL: 'INVITED',
  DEACTIVATED_LABEL: 'DEACTIVATED',

  DEACTIVATE_ACTION:   'Deactivate',
  REACTIVATE_ACTION:   'Reactivate',
  RESEND_INVITE:       'Resend Invite',

  PAGE_SIZE: 8,
  SHOWING: (from: number, to: number, total: number) =>
    `Showing ${from}–${to} of ${total} members`,
  PREVIOUS: 'Previous',
  NEXT: 'Next',

  // Invite modal
  MODAL_HEADING:    'Invite Team Member',
  LABEL_EMAIL:      'Email Address',
  EMAIL_PLACEHOLDER: 'e.g. name@company.com',
  EMAIL_HINT:       'They will receive an invitation email with a secure link to set their password.',
  LABEL_ROLE:       'Assign Role',
  CANCEL:           'Cancel',
  SEND_INVITE:      'Send Invite',

  ROLE_OPTIONS: [
    {
      value: 'DISPATCHER' as UserRole,
      label: 'Dispatcher',
      description: 'Can manage orders, assign drivers, and monitor deliveries.',
    },
    {
      value: 'DRIVER' as UserRole,
      label: 'Driver',
      description: 'Mobile access to active routes, POD capture, and status updates.',
    },
  ],

  // Mobile
  ACTIVE_COUNT_BADGE: (n: number) => `${n} ACTIVE`,
  MOBILE_SUBHEADING:  'Manage roles and permissions for your logistics crew.',
  LABEL_FULL_NAME:    'Full Name',
  NAME_PLACEHOLDER:   'e.g. John Doe',
  LABEL_WORK_EMAIL:   'Work Email Address',
  SEND_INVITATION:    'Send Invitation',
} as const;
