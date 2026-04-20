import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await request.json()) as unknown;
  return proxyToBackend(request, `/users/${id}/status`, { method: 'PATCH', body });
}
