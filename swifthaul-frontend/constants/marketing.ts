// ─────────────────────────────────────────────────────────────
// marketing.ts — System messages for all landing page content
// Import from here instead of hardcoding strings in components.
// ─────────────────────────────────────────────────────────────

// ── Navbar ────────────────────────────────────────────────────

export const NAVBAR = {
  SIGN_IN: "Sign In",
  OPEN_MENU_ARIA_LABEL: "Open menu",
  CLOSE_MENU_ARIA_LABEL: "Close menu",
  NAV_LINKS: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Drivers", href: "#" },
  ],
} as const;

// ── Hero ──────────────────────────────────────────────────────

export const HERO = {
  HEADING: "Real-time delivery tracking for your logistics operation.",
  SUBHEADING:
    "SwiftHaul replaces messy WhatsApp dispatching with a unified digital operations hub. Reliable tracking, instant proof of delivery, and analytics all in one place.",
  CTA_PRIMARY: "Sign In",
  CTA_SECONDARY: "See How It Works",
} as const;

// ── Features ──────────────────────────────────────────────────

export const FEATURES_SECTION = {
  HEADING: "Engineered for Operational Excellence",
  SUBHEADING:
    "Everything you need to manage a high-performance delivery fleet at scale.",
} as const;

/** Text content only — icons are assigned in the component via FEATURES_ICON_MAP. */
export const FEATURES_LIST = [
  {
    key: "tracking",
    title: "Real-Time Tracking",
    description:
      "Live GPS tracking for every driver in your fleet. No more 'where are you?' phone calls.",
  },
  {
    key: "dispatch",
    title: "Smart Dispatch",
    description:
      "Intelligent order assignment to the nearest available driver with one tap. Optimize every route.",
  },
  {
    key: "pod",
    title: "Proof of Delivery",
    description:
      "Digital signatures and photo capture for every drop-off. Total transparency for customers.",
  },
  {
    key: "analytics",
    title: "Analytics Dashboard",
    description:
      "Data-driven insights to optimize your routes and performance. Delivered daily.",
  },
] as const;

// ── How It Works ──────────────────────────────────────────────

export const HOW_IT_WORKS = {
  HEADING: "Simple, Seamless, Scalable",
  SUBHEADING: "Get your logistics operation running in three easy steps.",
  STEPS: [
    {
      number: 1,
      title: "Create Order",
      description:
        "Input delivery details, recipient info, and priority through our simple web interface to operate seamlessly.",
    },
    {
      number: 2,
      title: "Assign Driver",
      description:
        "Drivers receive an instant notification on their mobile app to accept and start the journey.",
    },
    {
      number: 3,
      title: "Track Live",
      description:
        "Both you and the customer track the driver's progress in real-time until the package is safe.",
    },
  ],
} as const;

// ── CTA Banner ────────────────────────────────────────────────

export const CTA_BANNER = {
  HEADING: "Ready to streamline your fleet?",
  SUBHEADING:
    "Join hundreds of logistics companies using SwiftHaul to eliminate manual paperwork and boost delivery success rates.",
  CTA: "Get Started Today",
} as const;

// ── Footer ────────────────────────────────────────────────────

export const FOOTER = {
  COPYRIGHT: "© 2026 SwiftHaul Logistics. All rights reserved.",
  LINKS: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Support", href: "#" },
    { label: "Contact", href: "#" },
  ],
} as const;
