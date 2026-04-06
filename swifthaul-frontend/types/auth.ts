import type { z } from "zod";
import type {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  acceptInviteSchema,
} from "@/lib/validations/auth";

export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

export type PasswordStrength = "weak" | "fair" | "good" | "strong";
