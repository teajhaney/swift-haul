'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiTrackingResponse } from '@/types/tracking';

interface TrackingApiResponse {
  data: ApiTrackingResponse;
}

export function useTracking(token: string) {
  return useQuery({
    queryKey: ['tracking', token],
    queryFn: async () => {
      const res = await api.get<TrackingApiResponse>(
        `/orders/track/${token}`,
      );
      return res.data.data;
    },
    enabled: Boolean(token),
    staleTime: 30 * 1000,
    retry: false,
  });
}
