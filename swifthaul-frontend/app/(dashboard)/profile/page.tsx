'use client';

import Link from 'next/link';
import { KeyRound, Mail, UserRound } from 'lucide-react';
import { useMe } from '@/hooks/auth/use-me';

export default function ProfilePage() {
  const { data: me, isLoading } = useMe();

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage your account information and password.
        </p>
      </div>

      <section className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary-light flex items-center justify-center">
            <UserRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {isLoading ? 'Loading...' : (me?.name ?? '—')}
            </p>
            <p className="text-xs text-text-muted">{me?.role ?? ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Mail className="w-4 h-4 text-text-muted shrink-0" />
          <span>{isLoading ? 'Loading...' : (me?.email ?? '—')}</span>
        </div>
      </section>

      <section className="bg-surface rounded-xl border border-border shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Password
            </p>
            <p className="text-sm text-text-secondary mt-0.5">
              Update your current password for account security.
            </p>
          </div>
          <Link
            href="/change-password"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Change Password
          </Link>
        </div>
      </section>
    </div>
  );
}
