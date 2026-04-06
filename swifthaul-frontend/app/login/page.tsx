"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthFooter } from "@/components/auth/auth-footer";
import { PasswordInput } from "@/components/auth/password-input";
import { Logo } from "@/components/shared/logo";
import { loginSchema } from "@/lib/validations/auth";
import type { LoginFormData } from "@/types/auth";
import { LOGIN } from "@/constants/auth";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberDevice: false },
  });

  const rememberDevice = useWatch({ control, name: "rememberDevice" });

  const onSubmit = async () => {
    // Backend integration later
    router.push("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md flex flex-col gap-8">

        {/* Logo */}
        <div className="flex justify-center">
          <Logo size={36} />
        </div>

        {/* Card */}
        <div className="auth-card">
          <h1 className="text-2xl font-bold text-[#0F2B46] mb-6">
            {LOGIN.HEADING}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

            {/* Email */}
            <div className="form-field">
              <Label htmlFor="email" className="text-sm font-medium text-[#1E293B]">
                {LOGIN.EMAIL_LABEL}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={LOGIN.EMAIL_PLACEHOLDER}
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-field">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-[#1E293B]">
                  {LOGIN.PASSWORD_LABEL}
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#1A6FB5] hover:text-[#145A94] font-medium transition-colors"
                >
                  {LOGIN.FORGOT_LINK}
                </Link>
              </div>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>

            {/* Remember device */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberDevice}
                onCheckedChange={(checked) => setValue("rememberDevice", checked === true)}
              />
              <Label htmlFor="remember" className="text-sm text-[#64748B] cursor-pointer font-normal">
                {LOGIN.REMEMBER_LABEL}
              </Label>
            </div>

            <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
              {isSubmitting ? "Signing in…" : LOGIN.SUBMIT}
            </button>
          </form>

          {/* Secure badge */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex items-center justify-center gap-2 text-[#94A3B8]">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              {LOGIN.SECURE_BADGE}
            </span>
          </div>
        </div>

        {/* System status */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-[#10B981] text-[#10B981]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#10B981]">
              {LOGIN.SYSTEM_STATUS}
            </span>
          </div>
        </div>

        {/* Help text */}
        <div className="flex flex-col items-center gap-0.5 text-sm text-[#64748B]">
          <span>{LOGIN.HELP_TEXT}</span>
          <Link href="#" className="text-[#1A6FB5] hover:text-[#145A94] font-medium transition-colors">
            {LOGIN.HELP_LINK}
          </Link>
        </div>

        <AuthFooter />
      </div>
    </div>
  );
}
