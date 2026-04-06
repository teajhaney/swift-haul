// ─────────────────────────────────────────────────────────────
// messages.ts — General system messages used across the app.
// Page-specific text (marketing, auth) lives in its own file.
// Anything reusable / global goes here.
// ─────────────────────────────────────────────────────────────

// ── Coming Soon ───────────────────────────────────────────────

export const COMING_SOON = {
  HEADING: "Coming Soon",
  DEFAULT_DESCRIPTION:
    "We're working on this feature. It will be available in a future update.",
  GO_TO_DASHBOARD: "Go to Dashboard",
  GO_BACK: "Go Back",
} as const;

// ── Toast Notifications ───────────────────────────────────────

export const TOAST = {
  ORDER_CREATED: {
    title: "Order Created",
    description: (id: string) => `Order ${id} has been created successfully`,
  },
  ORDER_ASSIGNED: {
    title: "New Order Assigned",
    description: (id: string) => `${id} has been assigned to you`,
  },
  DELIVERY_FAILED: {
    title: "Delivery Failed",
    description: (id: string) => `Order ${id} failed — recipient not home`,
  },
  ASSIGNMENT_FAILED: {
    title: "Assignment Failed",
    description: "Driver is no longer available",
  },
  ORDER_DELIVERED: {
    title: "Order Delivered",
    description: (id: string) => `Order ${id} has been delivered successfully`,
  },
  SAVED: {
    title: "Changes saved",
    description: "Your changes have been saved.",
  },
  ERROR: {
    title: "Something went wrong",
    description: "Please try again.",
  },
} as const;

// ── Empty States ──────────────────────────────────────────────

export const EMPTY_STATE = {
  NO_ORDERS: {
    title: "No orders yet",
    description: "Create your first order to get started.",
  },
  NO_DRIVERS: {
    title: "No drivers yet",
    description: "Invite drivers to join your fleet.",
  },
  NO_NOTIFICATIONS: {
    title: "All caught up",
    description: "You have no notifications right now.",
  },
  NO_RESULTS: {
    title: "No results found",
    description: "Try adjusting your search or filters.",
  },
} as const;

// ── Generic UI ────────────────────────────────────────────────

export const UI = {
  LOADING: "Loading…",
  SAVING: "Saving…",
  CONFIRM_DELETE: "Are you sure? This action cannot be undone.",
  CANCEL: "Cancel",
  CONFIRM: "Confirm",
  SAVE: "Save changes",
  CLOSE: "Close",
  BACK: "Go Back",
} as const;
