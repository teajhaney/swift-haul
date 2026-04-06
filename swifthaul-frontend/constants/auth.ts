// ─────────────────────────────────────────────────────────────
// auth.ts — System messages for all auth screen content
// ─────────────────────────────────────────────────────────────

// ── Login ─────────────────────────────────────────────────────

export const LOGIN = {
  HEADING: "Sign in to SwiftHaul",
  SUBHEADING: "Operational Logistics Portal",
  EMAIL_LABEL: "Email address",
  EMAIL_PLACEHOLDER: "name@company.com",
  PASSWORD_LABEL: "Password",
  REMEMBER_LABEL: "Remember device",
  FORGOT_LINK: "Forgot password?",
  SUBMIT: "Sign In",
  SECURE_BADGE: "SECURE OPERATIONAL ACCESS",
  SYSTEM_STATUS: "SYSTEM STATUS: OPTIMAL",
  HELP_TEXT: "Need help accessing your account?",
  HELP_LINK: "Contact SwiftHaul Support",
} as const;

// ── Forgot Password ───────────────────────────────────────────

export const FORGOT_PASSWORD = {
  HEADING: "Reset your password",
  SUBHEADING: "Enter your email and we'll send you a verification code.",
  EMAIL_LABEL: "Email address",
  EMAIL_PLACEHOLDER: "name@company.com",
  SUBMIT: "Send Code",
  BACK_LINK: "← Back to sign in",
} as const;

// ── Reset Password ────────────────────────────────────────────

export const RESET_PASSWORD = {
  HEADING: "Enter verification code",
  SUBHEADING: "We sent a 6-digit code to your email.",
  OTP_LABEL: "Verification Code",
  NEW_PASSWORD_LABEL: "New password",
  NEW_PASSWORD_PLACEHOLDER: "Enter new password",
  CONFIRM_PASSWORD_LABEL: "Confirm password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm new password",
  SUBMIT: "Reset Password",
  RESEND_TEXT: "Didn't receive the code?",
  RESEND_LINK: "Resend",
  BACK_LINK: "← Back to login",
  SECURE_BADGE: "SECURE ENCRYPTION ENABLED",
} as const;

// ── Accept Invite / Join ──────────────────────────────────────

export const ACCEPT_INVITE = {
  HEADING: "Join SwiftHaul",
  SUBHEADING: "You've been invited to join the operations team.",
  FULL_NAME_LABEL: "Full Name",
  FULL_NAME_PLACEHOLDER: "John Doe",
  PHONE_LABEL: "Phone Number",
  PHONE_PLACEHOLDER: "+1 (555) 000-0000",
  PASSWORD_LABEL: "Password",
  CONFIRM_PASSWORD_LABEL: "Confirm Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm new password",
  SUBMIT: "Create Account →",
  TERMS_TEXT: "By creating an account, you agree to our",
  TERMS_LINK: "Terms of Service",
  PRIVACY_LINK: "Privacy Policy",
  SIGN_IN_TEXT: "Already have an account?",
  SIGN_IN_LINK: "Sign in",
} as const;

// ── Shared Footer ─────────────────────────────────────────────

export const AUTH_FOOTER = {
  COPYRIGHT: "© 2026 SwiftHaul Logistics. All rights reserved.",
  LINKS: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Support", href: "#" },
  ],
} as const;
