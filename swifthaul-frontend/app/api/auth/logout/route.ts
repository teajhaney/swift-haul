import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/proxy';

export async function POST(request: NextRequest) {
  try {
    const response = await proxyToBackend(request, '/auth/logout', {
      method: 'POST',
    });
    response.cookies.set('accessToken', '', { path: '/', maxAge: 0 });
    response.cookies.set('refreshToken', '', { path: '/', maxAge: 0 });
    return response;
  } catch {
    const response = NextResponse.json(
      { data: { message: 'Logged out' } },
      { status: 200 }
    );
    response.cookies.set('accessToken', '', { path: '/', maxAge: 0 });
    response.cookies.set('refreshToken', '', { path: '/', maxAge: 0 });
    return response;
  }
}
