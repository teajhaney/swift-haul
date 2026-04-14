import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  return proxyToBackend(request, `/orders/track/${token}`, { method: 'GET' });
}
