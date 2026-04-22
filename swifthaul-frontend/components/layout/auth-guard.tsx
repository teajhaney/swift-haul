'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMe } from '@/hooks/auth/use-me';
import { notify } from '@/lib/toast';
import { NAV_MESSAGES } from '@/constants/navigation';

function AuthGuardSearchParamsEffect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('unauthorized') !== 'settings') {
      return;
    }

    notify.error(
      NAV_MESSAGES.SETTINGS_ADMIN_ONLY_TITLE,
      NAV_MESSAGES.SETTINGS_ADMIN_ONLY_DESCRIPTION
    );

    router.replace(pathname);
  }, [pathname, router, searchParams]);

  return null;
}

// Calls /auth/me on mount to verify the session client-side.
// Triggers the Axios interceptor refresh flow if the access token is expired.
// Redirects to /login if the session cannot be recovered.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isError } = useMe();

  useEffect(() => {
    if (isError) {
      router.push('/login');
    }
  }, [isError, router]);

  return (
    <>
      <Suspense fallback={null}>
        <AuthGuardSearchParamsEffect />
      </Suspense>
      {children}
    </>
  );
}
