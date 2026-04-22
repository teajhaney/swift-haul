'use client';

import { useQuery } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import type { AuthUser } from '@/types/auth';

interface MeResponse {
  data: AuthUser;
}

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const res = await api.get<MeResponse>('/auth/me');
        const user = res.data.data;
        setUser(user);
        return user;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        // Only clear state if the server explicitly rejected the request (e.g. 401)
        // If it's a network error (no internet), don't clear the user's session.
        if (axiosError.response) {
           clear();
        }
        throw new Error('Not authenticated');
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
