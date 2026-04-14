'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';
import type { AssignDriverPayload } from '@/types/order';

export function useAssignDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referenceId, driverId, note }: AssignDriverPayload) =>
      api.patch(`/orders/${referenceId}/assign`, { driverId, note }),
    onSuccess: (_, { referenceId }) => {
      queryClient.invalidateQueries({ queryKey: ['order', referenceId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Driver assigned successfully');
    },
    onError: (error) => {
      toast.error(
        getBackendErrorMessage(error) ?? 'Failed to assign driver.',
      );
    },
  });
}
