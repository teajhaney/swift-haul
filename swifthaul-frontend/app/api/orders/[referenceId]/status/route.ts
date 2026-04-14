import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

type Params = { params: Promise<{ referenceId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { referenceId } = await params;
  const body = (await request.json()) as unknown;
  return proxyToBackend(request, `/orders/${referenceId}/status`, {
    method: 'PATCH',
    body,
  });
}
