import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as unknown;
  return proxyToBackend(request, '/auth/login', { method: 'POST', body });
}
