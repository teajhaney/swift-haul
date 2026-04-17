"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { Logo } from "@/components/shared/logo";
import { useChangePassword } from "@/hooks/auth/use-change-password";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md flex flex-col gap-8">

        <div className="flex justify-center">
          <Logo size={36} />
        </div>

        <div className="auth-card">
          <h1 className="text-2xl font-bold text-[#0F2B46] mb-2">
            Change password
          </h1>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
            Enter your current password and choose a new one.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

            <div className="form-field">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-[#1E293B]">
                Current password
              </Label>
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                aria-invalid={!!errors.currentPassword}
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="field-error">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="form-field">
              <Label htmlFor="newPassword" className="text-sm font-medium text-[#1E293B]">
                New password
              </Label>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="field-error">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="form-field">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1E293B]">
                Confirm new password
              </Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="field-error">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || changePassword.isPending}
              className="auth-submit-btn"
            >
              {(isSubmitting || changePassword.isPending) ? "Saving…" : "Update password"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex items-center justify-center gap-2 text-[#94A3B8]">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              Secured connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
