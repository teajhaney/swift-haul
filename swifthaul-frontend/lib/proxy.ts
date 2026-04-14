import { NextRequest, NextResponse } from 'next/server';

type ProxyOptions = {
  method?: string;
  body?: unknown;
  searchParams?: string;
};

// Forward a Next.js API route request to the NestJS backend.
// Copies the incoming cookie header so HttpOnly auth cookies travel with the request.
// Copies any Set-Cookie headers back so new tokens reach the browser.
export async function proxyToBackend(
  request: NextRequest,
  path: string,
  options?: ProxyOptions,
): Promise<NextResponse> {
  const qs = options?.searchParams ? `?${options.searchParams}` : '';
  const backendUrl = `${process.env.BACKEND_URL}${path}${qs}`;

  const init: RequestInit = {
    method: options?.method ?? request.method,
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    ...(options?.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  };

  const backendRes = await fetch(backendUrl, init);
  const data = (await backendRes.json()) as unknown;

  const response = NextResponse.json(data, { status: backendRes.status });

  // Forward Set-Cookie headers so login/refresh/logout tokens reach the browser
  backendRes.headers.getSetCookie().forEach((cookie) => {
    response.headers.append('Set-Cookie', cookie);
  });

  return response;
}
