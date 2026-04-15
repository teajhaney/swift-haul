'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiNotificationListResponse, NotificationFilters } from '@/types/notification';

export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.isRead !== undefined) params.isRead = filters.isRead;

      const res = await api.get<ApiNotificationListResponse>('/notifications', { params });
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}
