'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AuthFooter } from '@/components/auth/auth-footer';
import { PasswordInput } from '@/components/auth/password-input';
import { OtpInput } from '@/components/auth/otp-input';
import { Logo } from '@/components/shared/logo';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { useResetPassword } from '@/hooks/auth/use-reset-password';
import type { ResetPasswordFormData } from '@/types/auth';
import { RESET_PASSWORD } from '@/constants/auth';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate({ ...data, email });
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
          <h1 className="text-2xl font-bold text-[#0F2B46] mb-2 text-center">
            {RESET_PASSWORD.HEADING}
          </h1>
          <p className="text-sm text-[#64748B] text-center mb-8 leading-relaxed">
            {RESET_PASSWORD.SUBHEADING}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* OTP — controlled because it's a custom multi-input */}
            <div className="form-field">
              <Label className="text-sm font-medium text-[#1E293B]">
                {RESET_PASSWORD.OTP_LABEL}
              </Label>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <OtpInput
                    value={field.value.split('')}
                    onChange={digits => field.onChange(digits.join(''))}
                  />
                )}
              />
              <div className="flex items-center justify-between">
                {errors.otp ? (
                  <p className="field-error">{errors.otp.message}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-[#94A3B8]">
                  {RESET_PASSWORD.RESEND_TEXT}{' '}
                  <button
                    type="button"
                    className="text-[#1A6FB5] hover:text-[#145A94] font-medium transition-colors"
                  >
                    {RESET_PASSWORD.RESEND_LINK}
                  </button>
                </p>
              </div>
            </div>

            {/* New password */}
            <div className="form-field">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-[#1E293B]"
              >
                {RESET_PASSWORD.NEW_PASSWORD_LABEL}
              </Label>
              <PasswordInput
                id="newPassword"
                placeholder={RESET_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
                autoComplete="new-password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="field-error">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="form-field">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#1E293B]"
              >
                {RESET_PASSWORD.CONFIRM_PASSWORD_LABEL}
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder={RESET_PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="field-error">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || resetPassword.isPending}
              className="auth-submit-btn"
            >
              {isSubmitting || resetPassword.isPending
                ? 'Resetting…'
                : RESET_PASSWORD.SUBMIT}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="text-sm text-[#1A6FB5] hover:text-[#145A94] font-medium transition-colors"
            >
              {RESET_PASSWORD.BACK_LINK}
            </Link>
          </div>

          {/* Secure badge */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex items-center justify-center gap-2 text-[#94A3B8]">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              {RESET_PASSWORD.SECURE_BADGE}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mt-4">
        <AuthFooter />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
