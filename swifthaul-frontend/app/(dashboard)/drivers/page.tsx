'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserRoundPlus,
  Users,
} from 'lucide-react';

import { DriverAvailabilityBadge } from '@/components/drivers/driver-availability-badge';
import { DRIVERS, AVAILABILITY_STYLES } from '@/constants/drivers';
import { useDrivers } from '@/hooks/drivers/use-drivers';
import { getInitials, getPageNumbers, VEHICLE_LABELS } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import type { DriverAvailabilityFilter } from '@/types/driver';
import Image from 'next/image';

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebounced] = useState('');
  const [availFilter, setAvailFilter] =
    useState<DriverAvailabilityFilter>('ALL');
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search — avoids firing on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(search), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const { data, isLoading, isError } = useDrivers({
    page,
    limit: DRIVERS.PAGE_SIZE,
    search: debouncedSearch || undefined,
    availability: availFilter,
  });

  const { user, isLoading: authLoading } = useAuthStore();
  const isAuthorized =
    user && (user.role === 'ADMIN' || user.role === 'DISPATCHER');

  const drivers = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / DRIVERS.PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * DRIVERS.PAGE_SIZE + 1;
  const to = Math.min(page * DRIVERS.PAGE_SIZE, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  const hasActiveFilters = search !== '' || availFilter !== 'ALL';

  function updateSearch(val: string) {
    setSearch(val);
    setPage(1);
  }
  function updateFilter(val: DriverAvailabilityFilter) {
    setAvailFilter(val);
    setPage(1);
  }
  function clearFilters() {
    setSearch('');
    setAvailFilter('ALL');
    setPage(1);
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {DRIVERS.PAGE_HEADING}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {DRIVERS.PAGE_SUBHEADING}
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => updateSearch(e.target.value)}
            placeholder={DRIVERS.SEARCH_PLACEHOLDER}
            className="w-full h-9 pl-9 pr-3 rounded-lg text-sm bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/20 transition-colors"
            style={{ border: '1px solid var(--color-border)' }}
          />
        </div>

        <div className="relative">
          <select
            value={availFilter}
            onChange={e =>
              updateFilter(e.target.value as DriverAvailabilityFilter)
            }
            className="h-9 pl-3 pr-8 rounded-lg text-sm text-text-secondary appearance-none focus:outline-none focus:ring-2 focus:ring-primary-light/20 transition-colors cursor-pointer"
            style={{
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            {DRIVERS.AVAILABILITY_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none rotate-90" />
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {authLoading ? (
          <div className="flex flex-col gap-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-surface-elevated animate-pulse"
              />
            ))}
          </div>
        ) : !isAuthorized ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-base font-semibold text-text-primary mb-1">
              {DRIVERS.ACCESS_DENIED}
            </p>
            <p className="text-sm text-text-secondary">
              {DRIVERS.ACCESS_DENIED_HINT}
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-lg bg-surface-elevated animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <p className="text-base font-semibold text-text-primary mb-1">
              {DRIVERS.FAILED_TO_LOAD}
            </p>
            <p className="text-sm text-text-secondary">
              {DRIVERS.FAILED_TO_LOAD_HINT}
            </p>
          </div>
        ) : drivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-text-muted" />
            </div>
            <p className="text-base font-semibold text-text-primary mb-1">
              {DRIVERS.NO_RESULTS}
            </p>
            <p className="text-sm text-text-secondary mb-5">
              {DRIVERS.NO_RESULTS_HINT}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
              >
                {DRIVERS.CLEAR_FILTERS}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-elevated border-b border-border">
                    {[
                      DRIVERS.COL_DRIVER,
                      DRIVERS.COL_CONTACT_VEHICLE,
                      DRIVERS.COL_STATUS,
                      DRIVERS.COL_CURRENT_LOAD,
                      DRIVERS.COL_COMPLETED_TODAY,
                      DRIVERS.COL_AVG_TIME,
                      DRIVERS.COL_ACTIONS,
                    ].map(col => (
                      <th
                        key={col}
                        className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {drivers.map(driver => {
                    const successPct = Math.round(driver.successRate);
                    const barColor =
                      successPct >= 90
                        ? 'bg-success'
                        : successPct >= 70
                          ? 'bg-warning'
                          : 'bg-error';
                    const isOffline = driver.availability === 'OFFLINE';
                    const initials = getInitials(driver.name);
                    const vehicle = VEHICLE_LABELS[driver.vehicleType];

                    return (
                      <tr
                        key={driver.id}
                        className="hover:bg-surface-elevated transition-colors"
                      >
                        {/* Driver */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {driver.avatarUrl ? (
                              <Image
                                src={driver.avatarUrl}
                                alt={driver.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-white">
                                  {initials}
                                </span>
                              </div>
                            )}
                            <div>
                              <p
                                className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                              >
                                {driver.name}
                              </p>
                              <p className="text-xs text-text-muted">
                                {driver.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact & Vehicle */}
                        <td className="px-5 py-3.5">
                          <p
                            className={`text-sm ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                          >
                            {driver.phone ?? '—'}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${isOffline ? 'bg-surface-elevated text-text-muted' : 'bg-primary-subtle text-primary-light'}`}
                            >
                              {vehicle}
                            </span>
                            <span className="text-xs font-mono text-text-muted">
                              {driver.vehiclePlate}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${AVAILABILITY_STYLES[driver.availability].dot}`}
                            />
                            <span
                              className={`text-sm font-medium ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                            >
                              {AVAILABILITY_STYLES[driver.availability].label}
                            </span>
                          </div>
                        </td>

                        {/* Success Rate (replaces currentLoad — not in list endpoint) */}
                        <td className="px-5 py-3.5 min-w-[150px]">
                          {isOffline ? (
                            <p className="text-sm text-text-muted">
                              {driver.completedToday === 0
                                ? DRIVERS.IN_ACTIVE
                                : DRIVERS.SHIFT_ENDED}
                            </p>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-text-primary">
                                  Success rate
                                </span>
                                <span className="text-xs text-text-muted">
                                  {successPct}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${barColor}`}
                                  style={{ width: `${successPct}%` }}
                                />
                              </div>
                            </>
                          )}
                        </td>

                        {/* Completed Today */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                          >
                            {driver.completedToday}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-sm ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                          >
                            ★ {driver.rating.toFixed(1)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/drivers/${driver.id}`}
                            className="text-sm font-semibold text-primary-light hover:text-primary-hover transition-colors whitespace-nowrap"
                          >
                            {DRIVERS.VIEW_PROFILE}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-border">
              {drivers.map(driver => {
                const successPct = Math.round(driver.successRate);
                const barColor =
                  successPct >= 90
                    ? 'bg-success'
                    : successPct >= 70
                      ? 'bg-warning'
                      : 'bg-error';
                const isOffline = driver.availability === 'OFFLINE';
                const initials = getInitials(driver.name);
                const vehicle = VEHICLE_LABELS[driver.vehicleType];

                return (
                  <Link
                    key={driver.id}
                    href={`/drivers/${driver.id}`}
                    className="block px-4 py-4 hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          {driver.avatarUrl ? (
                            <Image
                              src={driver.avatarUrl}
                              alt={driver.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {initials}
                              </span>
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${AVAILABILITY_STYLES[driver.availability].dot}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                          >
                            {driver.name}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {vehicle} · ★ {driver.rating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <DriverAvailabilityBadge
                        availability={driver.availability}
                      />
                    </div>

                    {/* Success rate bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                          Success rate
                        </span>
                        <span className="text-xs text-text-muted">
                          {successPct}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${successPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">
                          Completed today
                        </p>
                        <p
                          className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                        >
                          {driver.completedToday}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">
                          Total
                        </p>
                        <p
                          className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}
                        >
                          {driver.totalDeliveries}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination footer */}
        {total > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-4">
            <p className="text-xs text-text-secondary shrink-0">
              {DRIVERS.SHOWING(from, to, total)}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 text-center text-xs text-text-muted"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-surface-elevated'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FAB — mobile only */}
      <button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg flex items-center justify-center transition-colors z-10 lg:hidden"
        aria-label={DRIVERS.ADD_DRIVER_LABEL}
      >
        <UserRoundPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
