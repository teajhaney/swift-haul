'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiDriverDetail } from '@/types/driver';

interface DriverDetailResponse {
  data: ApiDriverDetail;
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: async () => {
      const res = await api.get<DriverDetailResponse>(`/drivers/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}
