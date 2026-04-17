'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/stores/auth.store';

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);
  const user = useAuthStore(s => s.user);

  return useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      api.post('/auth/change-password', data),
    onSuccess: () => {
      // Clear mustResetPassword flag in the store
      if (user) {
        setUser({ ...user, mustResetPassword: false });
      }
      toast.success('Password updated');
      const home = user?.role === 'DRIVER' ? '/driver/orders' : '/dashboard';
      router.push(home);
    },
    onError: error => {
      toast.error(
        getBackendErrorMessage(error) ?? 'Current password is incorrect'
      );
    },
  });
}
