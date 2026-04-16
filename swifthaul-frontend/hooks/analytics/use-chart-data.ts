'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ChartResponse, TimeRange } from '@/types/analytics';

interface ChartApiResponse {
  data: ChartResponse;
}

interface ChartParams {
  range?: Exclude<TimeRange, 'custom'>;
  startDate?: string;
  endDate?: string;
}

// fetch daily/weekly delivery counts for the selected time range
export function useChartData(params: ChartParams) {
  const { range = '7d', startDate, endDate } = params;
  const isCustom = !!(startDate && endDate);

  return useQuery({
    queryKey: ['analytics', 'chart', isCustom ? { startDate, endDate } : range],
    queryFn: async () => {
      const queryParams: Record<string, string> = isCustom
        ? { startDate: startDate!, endDate: endDate! }
        : { range };
      const res = await api.get<ChartApiResponse>('/analytics/chart', {
        params: queryParams,
      });
      return res.data.data.points;
    },
    staleTime: 60 * 1000,
    // only run custom query when both dates are provided
    enabled: isCustom ? true : true,
  });
}
