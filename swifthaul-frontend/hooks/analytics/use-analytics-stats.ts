'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DashboardStats } from '@/types/analytics';

interface StatsResponse {
  data: DashboardStats;
}

// fetch dashboard KPI stats
export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const res = await api.get<StatsResponse>('/analytics/stats');
      return res.data.data;
    },
    staleTime: 60 * 1000, // re-fetch after 1 minute
  });
}
