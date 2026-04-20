import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ListUsersQuery, PaginatedUsers } from '@/types/users';

export function useUsers(query: ListUsersQuery = {}) {
  return useQuery({
    queryKey: ['users', query],
    queryFn: async () => {
      const { data } = await api.get<PaginatedUsers>('/users', { params: query });
      return data;
    },
  });
}
