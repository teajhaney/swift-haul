'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';
import type { UserRole } from '@/types/settings';

interface InvitePayload {
  email: string;
  role: UserRole;
}

export function useInvite() {
  return useMutation({
    mutationFn: (data: InvitePayload) =>
      api.post<{ message: string }>('/auth/invite', {
        email: data.email,
        role: data.role,
      }),
    onError: error => {
      toast.error(
        getBackendErrorMessage(error) ??
          'Unable to send invite. Please try again.'
      );
    },
  });
}
