'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { StatusBreakdownResponse } from '@/types/analytics';

interface StatusBreakdownApiResponse {
  data: StatusBreakdownResponse;
}

// fetch order status breakdown for the donut chart
export function useStatusBreakdown() {
  return useQuery({
    queryKey: ['analytics', 'status-breakdown'],
    queryFn: async () => {
      const res = await api.get<StatusBreakdownApiResponse>('/analytics/status-breakdown');
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}
