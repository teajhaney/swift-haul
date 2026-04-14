import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as unknown;
  return proxyToBackend(request, `/drivers/${id}/availability`, { method: 'PATCH', body });
}
