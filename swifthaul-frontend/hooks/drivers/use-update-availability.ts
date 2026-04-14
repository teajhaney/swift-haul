'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';
import type { DriverAvailability } from '@/types/driver';

interface UpdateAvailabilityPayload {
  id: string;
  availability: DriverAvailability;
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, availability }: UpdateAvailabilityPayload) =>
      api.patch(`/drivers/${id}/availability`, { availability }),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['drivers', id] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Availability updated');
    },
    onError: error => {
      toast.error(
        getBackendErrorMessage(error) ?? 'Failed to update availability'
      );
    },
  });
}
