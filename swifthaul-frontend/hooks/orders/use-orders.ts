'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiOrderListResponse,OrderFilters } from '@/types/order';

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.status) params.status = filters.status;
      if (filters.statuses) params.statuses = filters.statuses;
      if (filters.search) params.search = filters.search;
      if (filters.driverId) params.driverId = filters.driverId;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const res = await api.get<ApiOrderListResponse>('/orders', { params });
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}
