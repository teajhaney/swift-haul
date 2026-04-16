import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // custom date range — forward startDate + endDate, omit range
  if (startDate && endDate) {
    return proxyToBackend(request, '/analytics/chart', {
      method: 'GET',
      searchParams: `startDate=${startDate}&endDate=${endDate}`,
    });
  }

  const range = searchParams.get('range') ?? '7d';
  return proxyToBackend(request, '/analytics/chart', {
    method: 'GET',
    searchParams: `range=${range}`,
  });
}
