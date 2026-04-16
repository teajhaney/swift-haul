'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';
import type { OrderStatus } from '@/types/order';

interface UpdateStatusPayload {
  referenceId: string;
  status: OrderStatus;
  note?: string;
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referenceId, status, note }: UpdateStatusPayload) =>
      api.patch(`/orders/${referenceId}/status`, { status, note }),
    onSuccess: (_, { referenceId }) => {
      queryClient.invalidateQueries({ queryKey: ['order', referenceId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error) => {
      toast.error(
        getBackendErrorMessage(error) ?? 'Failed to update order status.',
      );
    },
  });
}
