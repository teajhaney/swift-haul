'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { AcceptInviteFormData } from '@/types/auth';

interface AcceptInvitePayload extends AcceptInviteFormData {
  token: string;
}

export function useAcceptInvite() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AcceptInvitePayload) =>
      api.post('/auth/accept-invite', {
        token: data.token,
        name: data.fullName,
        phone: data.phone,
        password: data.password,
        vehicleType: data.vehicleType,
        vehiclePlate: data.vehiclePlate,
      }),
    onSuccess: () => {
      toast.success('Account created — please sign in');
      router.push('/login');
    },
    onError: () => {
      toast.error('This invite link is invalid or has expired');
    },
  });
}
