'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';
import type { UpdateOrderPayload } from '@/types/order';

export function useUpdateOrder(referenceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrderPayload) =>
      api.patch(`/orders/${referenceId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', referenceId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Order updated successfully');
    },
    onError: (error) => {
      toast.error(
        getBackendErrorMessage(error) ?? 'Failed to update order.',
      );
    },
  });
}
