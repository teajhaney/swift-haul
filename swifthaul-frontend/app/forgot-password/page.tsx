"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFooter } from "@/components/auth/auth-footer";
import { Logo } from "@/components/shared/logo";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import type { ForgotPasswordFormData } from "@/types/auth";
import { FORGOT_PASSWORD } from "@/constants/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (_data: ForgotPasswordFormData) => {
    // Backend integration later
    router.push("/reset-password");
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size={36} />
        </div>

        {/* Card */}
        <div className="auth-card text-center">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-[#E8F4FD] flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-[#1A6FB5]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#0F2B46] mb-2">
            {FORGOT_PASSWORD.HEADING}
          </h1>
          <p className="text-sm text-[#64748B] mb-8 leading-relaxed">
            {FORGOT_PASSWORD.SUBHEADING}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="text-left space-y-4">
            <div className="form-field">
              <Label htmlFor="email" className="text-sm font-medium text-[#1E293B]">
                {FORGOT_PASSWORD.EMAIL_LABEL}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={FORGOT_PASSWORD.EMAIL_PLACEHOLDER}
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
              {isSubmitting ? "Sending…" : FORGOT_PASSWORD.SUBMIT}
            </button>
          </form>

          <Link
            href="/login"
            className="inline-block mt-5 text-sm text-[#1A6FB5] hover:text-[#145A94] font-medium transition-colors"
          >
            {FORGOT_PASSWORD.BACK_LINK}
          </Link>
        </div>
      </div>

      <div className="w-full max-w-md mt-4">
        <AuthFooter />
      </div>
    </div>
  );
}
