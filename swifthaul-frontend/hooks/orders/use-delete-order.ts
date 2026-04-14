'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referenceId: string) =>
      api.delete(`/orders/${referenceId}`),
    onSuccess: (_, referenceId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.removeQueries({ queryKey: ['order', referenceId] });
      toast.success(`Order ${referenceId} deleted`);
    },
    onError: (error) => {
      toast.error(
        getBackendErrorMessage(error) ??
          'Failed to delete order. Only delivered or cancelled orders can be deleted.',
      );
    },
  });
}
