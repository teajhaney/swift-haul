'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiNotificationListResponse, NotificationFilters } from '@/types/notification';

export function useUserNotifications(userId: string, filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: ['notifications', 'user', userId, filters],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.isRead !== undefined) params.isRead = filters.isRead;

      const res = await api.get<ApiNotificationListResponse>(`/notifications/user/${userId}`, { params });
      return res.data;
    },
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}
