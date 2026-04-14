'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      clear();
      queryClient.clear();
      router.push('/login');
    },
    onError: () => {
      // Clear client state regardless and redirect
      clear();
      queryClient.clear();
      router.push('/login');
      toast.error('Logout failed — you have been signed out locally');
    },
  });
}
