import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/orders', {
    method: 'GET',
    searchParams: request.nextUrl.searchParams.toString(),
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown;
  return proxyToBackend(request, '/orders', { method: 'POST', body });
}
