import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, errors } from 'jose';

// Paths that do not require authentication
const PUBLIC_EXACT = new Set([
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/change-password',
]);
const PUBLIC_PREFIXES = [
  '/accept-invite',
  '/track',
  '/api/',
  '/_next',
  '/favicon',
  '/logo',
  '/public',
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

function getHomeForRole(role: string) {
  return role === 'DRIVER' ? '/driver/orders' : '/dashboard';
}

type RefreshResult = {
  setCookies: string[];
  role: string | null;
};

// Attempt a silent token refresh via the NestJS backend.
// Returns new Set-Cookie headers and the refreshed user's role on success, null on failure.
async function tryRefresh(request: NextRequest): Promise<RefreshResult | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: request.headers.get('cookie') ?? '' },
    });

    if (!res.ok) return null;

    const body = (await res.json()) as { role?: string };
    return {
      setCookies: res.headers.getSetCookie(),
      role: body.role ?? null,
    };
  } catch {
    return null;
  }
}

function withSetCookies(response: NextResponse, setCookies: string[]) {
  setCookies.forEach((cookie) => response.headers.append('Set-Cookie', cookie));
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (isPublic(pathname)) {
    // Authenticated user landing on / or /login → send them home
    if ((pathname === '/' || pathname === '/login') && token) {
      try {
        const { payload } = await jwtVerify(token, getSecret());
        const role = payload['role'] as string;
        const home = getHomeForRole(role);
        return NextResponse.redirect(new URL(home, request.url));
      } catch {
        // Expired or invalid — fall through to refresh if possible
      }
    }

    if ((pathname === '/' || pathname === '/login') && refreshToken) {
      const refreshed = await tryRefresh(request);
      if (refreshed?.role) {
        const response = NextResponse.redirect(
          new URL(getHomeForRole(refreshed.role), request.url)
        );
        return withSetCookies(response, refreshed.setCookies);
      }
    }

    return NextResponse.next();
  }

  // No access token cookie (deleted after maxAge) — try refresh before giving up.
  // The refresh token cookie lasts 7 days, so the user may still have a valid session.
  if (!token) {
    const refreshed = await tryRefresh(request);
    if (refreshed) {
      return withSetCookies(NextResponse.next(), refreshed.setCookies);
    }

    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload['role'] as string;

    // DRIVER trying to access the dispatcher dashboard
    const isDispatcherRoute =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/orders') ||
      pathname.startsWith('/drivers') ||
      pathname.startsWith('/notifications') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/settings');

    if (isDispatcherRoute && role === 'DRIVER') {
      return NextResponse.redirect(new URL('/driver/orders', request.url));
    }

    // Admin/Dispatcher trying to access the driver app
    // Use '/driver/' prefix (with slash) so '/drivers' is not accidentally matched
    if ((pathname === '/driver' || pathname.startsWith('/driver/')) && role !== 'DRIVER') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Settings is admin-only
    if (pathname.startsWith('/settings') && role !== 'ADMIN') {
      const redirectUrl = new URL('/dashboard', request.url);
      redirectUrl.searchParams.set('unauthorized', 'settings');
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      // Access token is expired — try silent refresh before giving up
      const refreshed = await tryRefresh(request);
      if (refreshed) {
        return withSetCookies(NextResponse.next(), refreshed.setCookies);
      }
    }

    // Invalid token or refresh failed → send to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.ico).*)',
  ],
};
