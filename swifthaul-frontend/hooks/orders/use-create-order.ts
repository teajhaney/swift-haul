'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { getBackendErrorMessage } from '@/lib/errors';

export interface CreateOrderPayload {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryAddress: string;
  deliveryLat?: number;
  deliveryLng?: number;
  packageDescription: string;
  weightKg?: number;
  dimensions?: string;
  priority?: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  notes?: string;
  scheduledPickupTime?: string;
  estimatedDelivery?: string;
}

interface CreateOrderResponse {
  data: { referenceId: string };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      api.post<CreateOrderResponse>('/orders', payload),
    onSuccess: (res) => {
      const referenceId = res.data.data.referenceId;
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success(`Order ${referenceId} created successfully`);
    },
    onError: (error) => {
      toast.error(
        getBackendErrorMessage(error) ?? 'Failed to create order. Please try again.',
      );
    },
  });
}
