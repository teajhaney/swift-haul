'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiDriverListResponse, DriverAvailability } from '@/types/driver';

interface UseDriversParams {
  page?: number;
  limit?: number;
  search?: string;
  availability?: DriverAvailability | 'ALL';
}

export function useDrivers(params: UseDriversParams = {}) {
  const { page = 1, limit = 10, search, availability } = params;

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));
  if (search) queryParams.set('search', search);
  if (availability && availability !== 'ALL') {
    queryParams.set('availability', availability);
  }

  return useQuery({
    queryKey: ['drivers', { page, limit, search, availability }],
    queryFn: async () => {
      const res = await api.get<ApiDriverListResponse>(
        `/drivers?${queryParams.toString()}`,
      );
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}
