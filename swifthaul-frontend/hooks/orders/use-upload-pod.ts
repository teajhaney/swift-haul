'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getBackendErrorMessage } from '@/lib/errors';

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

      const res = await fetch(`/api/orders/${referenceId}/pod`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const err = (await res.json()) as {
          error?: { message?: string };
        };
        throw new Error(err.error?.message ?? 'POD upload failed');
      }

      return res.json() as Promise<UploadPodResponse>;
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
