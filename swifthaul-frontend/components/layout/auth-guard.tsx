'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/auth/use-me';

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

  return <>{children}</>;
}
