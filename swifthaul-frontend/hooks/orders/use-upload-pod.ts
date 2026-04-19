'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBackendErrorMessage } from '@/lib/errors';
import api from '@/lib/api';

interface UploadPodPayload {
  referenceId: string;
  photoFile: File;
  signedBy: string;
}

interface UploadPodResponse {
  data: {
    message: string;
  };
}

export function useUploadPod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      referenceId,
      photoFile,
      signedBy,
    }: UploadPodPayload): Promise<UploadPodResponse> => {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('signedBy', signedBy);

      const { data } = await api.post<UploadPodResponse>(
        `/orders/${referenceId}/pod`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return data;
    },
    onSuccess: (_, { referenceId }) => {
      // Invalidate order queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['order', referenceId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      toast.error(getBackendErrorMessage(error) ?? 'Failed to upload proof of delivery.');
    },
  });
}
