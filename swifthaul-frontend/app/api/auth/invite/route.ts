'use server';

import type { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToBackend(request, '/auth/invite', {
    method: 'POST',
    body,
  });
}
