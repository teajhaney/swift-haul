import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ referenceId: string }> }
) {
  const { referenceId } = await context.params;
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/orders/${referenceId}/pod`,
    {
      method: 'POST',
      headers: {
        cookie: request.headers.get('cookie') ?? '',
        'content-type': request.headers.get('content-type') ?? '',
      },
      body: request.body,
      // Required for Node/undici when passing a ReadableStream body through.
      duplex: 'half',
    } as unknown as RequestInit
  );

  const data = (await backendRes.json()) as unknown;
  const response = NextResponse.json(data, { status: backendRes.status });
  backendRes.headers.getSetCookie().forEach(cookie => {
    response.headers.append('Set-Cookie', cookie);
  });
  return response;
}
