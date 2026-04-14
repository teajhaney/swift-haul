'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';
import type { ResetPasswordFormData } from '@/types/auth';

interface ResetPasswordPayload extends ResetPasswordFormData {
  email: string;
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordPayload) =>
      api.post('/auth/reset-password', {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success('Password reset — please sign in');
      setTimeout(() => router.push('/login'), 200);
    },
    onError: error => {
      toast.error(
        getBackendErrorMessage(error) ??
          'Invalid or expired OTP. Please try again.'
      );
    },
  });
}
