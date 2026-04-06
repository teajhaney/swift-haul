"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFooter } from "@/components/auth/auth-footer";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrengthBar } from "@/components/auth/password-strength";
import { Logo } from "@/components/shared/logo";
import { acceptInviteSchema } from "@/lib/validations/auth";
import type { AcceptInviteFormData } from "@/types/auth";
import { ACCEPT_INVITE } from "@/constants/auth";

export default function AcceptInvitePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (_data: AcceptInviteFormData) => {
    // Backend integration later
    router.push("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size={36} />
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <h1 className="text-2xl font-bold text-[#0F2B46]">{ACCEPT_INVITE.HEADING}</h1>
            {/* Role badge — real value comes from decoded invite token */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] tracking-wider uppercase shrink-0">
              Dispatcher
            </span>
          </div>
          <p className="text-sm text-[#64748B] mb-6">{ACCEPT_INVITE.SUBHEADING}</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Full name */}
            <div className="form-field">
              <Label htmlFor="fullName" className="text-sm font-medium text-[#1E293B]">
                {ACCEPT_INVITE.FULL_NAME_LABEL}
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder={ACCEPT_INVITE.FULL_NAME_PLACEHOLDER}
                autoComplete="name"
                {...register("fullName")}
              />
              {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
            </div>

            {/* Phone */}
            <div className="form-field">
              <Label htmlFor="phone" className="text-sm font-medium text-[#1E293B]">
                {ACCEPT_INVITE.PHONE_LABEL}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={ACCEPT_INVITE.PHONE_PLACEHOLDER}
                autoComplete="tel"
                {...register("phone")}
              />
              {errors.phone && <p className="field-error">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="form-field">
              <Label htmlFor="password" className="text-sm font-medium text-[#1E293B]">
                {ACCEPT_INVITE.PASSWORD_LABEL}
              </Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                {...register("password")}
              />
              <PasswordStrengthBar password={passwordValue} />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div className="form-field">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#1E293B]">
                {ACCEPT_INVITE.CONFIRM_PASSWORD_LABEL}
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder={ACCEPT_INVITE.CONFIRM_PASSWORD_PLACEHOLDER}
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="field-error">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
              {isSubmitting ? "Creating account…" : ACCEPT_INVITE.SUBMIT}
            </button>

            <p className="text-xs text-[#64748B] text-center leading-relaxed">
              {ACCEPT_INVITE.TERMS_TEXT}{" "}
              <Link href="#" className="text-[#1A6FB5] hover:underline">
                {ACCEPT_INVITE.TERMS_LINK}
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#1A6FB5] hover:underline">
                {ACCEPT_INVITE.PRIVACY_LINK}
              </Link>
              .
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-[#64748B]">
            {ACCEPT_INVITE.SIGN_IN_TEXT}{" "}
            <Link
              href="/login"
              className="text-[#1A6FB5] hover:text-[#145A94] font-semibold transition-colors"
            >
              {ACCEPT_INVITE.SIGN_IN_LINK}
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mt-4">
        <AuthFooter />
      </div>
    </div>
  );
}
