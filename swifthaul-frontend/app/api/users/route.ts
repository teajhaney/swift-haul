import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function GET(request: NextRequest) {
	
  const searchParams = request.nextUrl.searchParams.toString();
  return proxyToBackend(request, '/users', {
    method: 'GET',
    searchParams,
  });
}
