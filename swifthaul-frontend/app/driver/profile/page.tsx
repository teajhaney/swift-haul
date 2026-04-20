'use client';

import {
  Phone,
  Mail,
  Truck,
  Star,
  Package,
  TrendingUp,
  Flame,
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import { useLogout } from '@/hooks/auth/use-logout';
import { useMe } from '@/hooks/auth/use-me';
import { useDriver } from '@/hooks/drivers/use-driver';
import { useUpdateAvailability } from '@/hooks/drivers/use-update-availability';
import {
  DRIVER_AVAILABILITY_OPTIONS,
  AVAILABILITY_TOGGLE_STYLES,
} from '@/constants/drivers';
import { getInitials, formatMemberSince } from '@/lib/utils';
import { useOrders } from '@/hooks/orders/use-orders';
import type { DriverAvailability } from '@/types/driver';

const VEHICLE_LABELS: Record<string, string> = {
  BIKE: 'Bike',
  CAR: 'Car',
  VAN: 'Van',
  TRUCK: 'Truck',
};

export default function DriverProfilePage() {
  const { data: me, isLoading: meLoading } = useMe();
  const { data: profile, isLoading: profileLoading } = useDriver(me?.id ?? '');
  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    page: 1,
    limit: 50,
    driverId: me?.id,
  });
  const { mutate: updateAvailability, isPending: availPending } =
    useUpdateAvailability();
  const logout = useLogout();

  const isLoading =
    meLoading || (!!me?.id && profileLoading) || (!!me?.id && ordersLoading);

  function handleAvailability(availability: DriverAvailability) {
    if (!me?.id || availability === profile?.availability) return;
    updateAvailability({ id: me.id, availability });
  }

  if (isLoading) {
    return (
      <>
        <DriverTopbar />
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-5 animate-pulse">
          <div className="bg-surface rounded-2xl border border-border p-6 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-surface-elevated" />
            <div className="h-5 w-40 bg-surface-elevated rounded" />
            <div className="h-3 w-24 bg-surface-elevated rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface rounded-xl border border-border p-4 h-24"
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  const name = me?.name ?? '';
  const initials = getInitials(name);
  const currentAvailability = (profile?.availability ??
    'OFFLINE') as DriverAvailability;

  // Derive stats dynamically from the actual orders matching History page logic
  const allOrders = ordersData?.data ?? [];
  const completedOrders = allOrders.filter(o => o.status === 'DELIVERED');
  const failedOrders = allOrders.filter(o => o.status === 'FAILED');

  const historicalCount = completedOrders.length + failedOrders.length;
  const totalDeliveries = historicalCount; // Total historical deliveries

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const completedToday = completedOrders.filter(o => {
    const d = new Date(o.updatedAt);
    return d >= startOfToday;
  }).length;

  const successRate =
    historicalCount > 0
      ? (completedOrders.length / historicalCount) * 100
      : 100;
  const rating = profile?.rating ? Number(profile.rating) : 5.0;

  return (
    <>
      <DriverTopbar />

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-5">
        {/* ── Profile hero ── */}
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-3 shadow-md">
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.avatarUrl}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">{initials}</span>
            )}
          </div>

          <h1 className="text-xl font-bold text-text-primary">{name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-subtle text-primary-light tracking-wide uppercase">
              {me?.role ?? 'DRIVER'}
            </span>
            {profile && (
              <span className="flex items-center gap-0.5 text-sm text-warning font-semibold">
                <Star className="w-3.5 h-3.5 fill-warning" />
                {rating.toFixed(1)}
              </span>
            )}
          </div>
          {profile?.memberSince && (
            <p className="text-xs text-text-muted mt-1">
              Joined {formatMemberSince(profile.memberSince)}
            </p>
          )}

          {/* Availability toggle */}
          <div className="flex gap-2 mt-5 w-full">
            {DRIVER_AVAILABILITY_OPTIONS.map(opt => {
              const isActive = currentAvailability === opt.value;
              const style = AVAILABILITY_TOGGLE_STYLES[opt.value];
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    handleAvailability(opt.value as DriverAvailability)
                  }
                  disabled={availPending}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-60 ${
                    isActive
                      ? style.active
                      : 'border-border bg-surface-elevated text-text-muted hover:border-border-strong'
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-white' : style.dot}`}
                  />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Stats grid ── */}
        {profile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center mx-auto mb-2">
                <Package className="w-4 h-4 text-primary-light" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {totalDeliveries}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
                Total Deliveries
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-warning fill-warning" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {rating.toFixed(1)}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
                Rating
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {successRate.toFixed(0)}%
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
                Success Rate
              </p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center mx-auto mb-2">
                <Flame className="w-4 h-4 text-accent" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {completedToday}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
                Today
              </p>
            </div>
          </div>
        )}

        {/* ── Contact info ── */}
        <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <Phone className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-sm text-text-secondary flex-1">
              {me?.email ? '—' : '—'}
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Mail className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-sm text-text-secondary flex-1">
              {me?.email ?? '—'}
            </span>
          </div>
        </div>

        {/* ── Vehicle info ── */}
        {profile && (
          <div className="bg-surface rounded-xl border border-border shadow-sm p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">
              Vehicle
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">
                  {VEHICLE_LABELS[profile.vehicleType] ?? profile.vehicleType}
                </p>
                <p className="text-xs text-text-muted font-mono mt-0.5">
                  {profile.vehiclePlate}
                </p>
              </div>
              <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-surface-elevated border border-border text-text-secondary tracking-wide uppercase">
                {profile.vehicleType}
              </span>
            </div>
          </div>
        )}

        {/* ── Settings links ── */}
        <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
          {[
            { icon: Shield, label: 'Privacy & Security' },
            { icon: HelpCircle, label: 'Help & Support' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-elevated transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-text-muted shrink-0" />
              <span className="flex-1 text-sm text-text-secondary">
                {label}
              </span>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          ))}
        </div>

        {/* ── Sign out ── */}
        <Link
          href="/change-password"
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
        >
          Change Password
        </Link>

        <button
          onClick={() => logout.mutate()}
          disabled={logout.status === 'pending'}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-error/30 text-error text-sm font-semibold hover:bg-error/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <DriverBottomNav />
    </>
  );
}
