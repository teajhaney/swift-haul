export const AUTH_MESSAGES = {
  // email subjects
  INVITE_EMAIL_SUBJECT: "You've been invited to SwiftHaul",
  OTP_EMAIL_SUBJECT: 'Your SwiftHaul password reset code',

  // email html bodies
  INVITE_EMAIL_BODY: (inviteUrl: string): string =>
    `<p>You have been invited to join SwiftHaul.</p>
     <p>Click the link below to set up your account:</p>
     <p><a href="${inviteUrl}">${inviteUrl}</a></p>
     <p>This link expires in 48 hours. If you did not expect this, ignore this email.</p>`,

  OTP_EMAIL_BODY: (otp: string): string =>
    `<p>Your SwiftHaul password reset code is:</p>
     <h2>${otp}</h2>
     <p>This code expires in 5 minutes.</p>
     <p>If you did not request a password reset, you can safely ignore this email.</p>`,

  // success response messages
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PASSWORD_CHANGED: 'Password updated successfully.',
  INVITE_SENT: 'Invite sent successfully.',
  INVITE_ACCEPTED: 'Account activated. You can now log in.',
  FORGOT_PASSWORD_SENT:
    'If that email is registered, a reset code has been sent.',
  PASSWORD_RESET: 'Password reset successfully.',

  // driver invite validation
  DRIVER_PROFILE_REQUIRED:
    'Drivers must provide vehicleType and vehiclePlate when accepting an invite.',

  // register (developer backdoor)
  REGISTER_SUCCESS: 'Admin account created successfully.',
  REGISTER_INVALID_SECRET: 'Invalid signup secret.',
} as const;
