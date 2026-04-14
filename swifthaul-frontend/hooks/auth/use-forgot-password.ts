'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { ForgotPasswordFormData } from '@/types/auth';

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      api.post('/auth/forgot-password', { email: data.email }),
    onSuccess: (_res, variables) => {
      toast.success('Check your email for the OTP code');
      // Pass the email to reset-password so it can send it with the OTP
      router.push(
        `/reset-password?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: () => {
      // Always show success to avoid leaking whether an email exists
      toast.success('If that email exists, an OTP has been sent');
    },
  });
}
