'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import type { AuthUser, LoginFormData } from '@/types/auth';

interface LoginResponse {
  data: AuthUser;
}

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      api.post<LoginResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      }),
    onSuccess: (res) => {
      const user = res.data.data;
      setUser(user);

      if (user.mustResetPassword) {
        router.push('/change-password');
        return;
      }

      if (user.role === 'DRIVER') {
        router.push('/driver/orders');
      } else {
        router.push('/dashboard');
      }
    },
    onError: () => {
      toast.error('Invalid email or password');
    },
  });
}
