import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { UpdateUserStatusPayload } from '@/types/users';
import { toast } from 'sonner';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserStatusPayload;
    }) => {
      const { data } = await api.patch(`/users/${id}/status`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to update user status';
      toast.error(message);
    },
  });
}
