import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  return proxyToBackend(request, '/orders', {
    method: 'GET',
    searchParams,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown;
  return proxyToBackend(request, '/orders', { method: 'POST', body });
}
