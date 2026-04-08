'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, UserRoundPlus, Users } from 'lucide-react';

import { DriverAvailabilityBadge } from '@/components/drivers/driver-availability-badge';
import { DRIVERS } from '@/constants/drivers';
import { MOCK_DRIVERS, AVAILABILITY_STYLES } from '@/constants/drivers-mock';
import type { DriverAvailabilityFilter } from '@/types/driver';

// ── Pagination helpers ────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

// ─────────────────────────────────────────────────────────────────────────────

export default function DriversPage() {
  const [search, setSearch]       = useState('');
  const [availFilter, setAvailFilter] = useState<DriverAvailabilityFilter>('ALL');
  const [page, setPage]           = useState(1);

  function updateSearch(val: string) { setSearch(val); setPage(1); }
  function updateFilter(val: DriverAvailabilityFilter) { setAvailFilter(val); setPage(1); }
  function clearFilters() { setSearch(''); setAvailFilter('ALL'); setPage(1); }

  const hasActiveFilters = search !== '' || availFilter !== 'ALL';

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_DRIVERS.filter(driver => {
      if (availFilter !== 'ALL' && driver.availability !== availFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          driver.name.toLowerCase().includes(q) ||
          driver.id.toLowerCase().includes(q) ||
          driver.vehicle.toLowerCase().includes(q) ||
          driver.vehiclePlate.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, availFilter]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / DRIVERS.PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const from        = filtered.length === 0 ? 0 : (safePage - 1) * DRIVERS.PAGE_SIZE + 1;
  const to          = Math.min(safePage * DRIVERS.PAGE_SIZE, filtered.length);
  const paginated   = filtered.slice(from - 1, to);
  const pageNumbers = getPageNumbers(safePage, totalPages);

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{DRIVERS.PAGE_HEADING}</h1>
        <p className="text-sm text-text-secondary mt-0.5">{DRIVERS.PAGE_SUBHEADING}</p>
      </div>

      {/* ── Search + filter ── */}
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
            onChange={e => updateFilter(e.target.value as DriverAvailabilityFilter)}
            className="h-9 pl-3 pr-8 rounded-lg text-sm text-text-secondary appearance-none focus:outline-none focus:ring-2 focus:ring-primary-light/20 transition-colors cursor-pointer"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
          >
            {DRIVERS.AVAILABILITY_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none rotate-90" />
        </div>
      </div>

      {/* ── Table / Cards ── */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-text-muted" />
            </div>
            <p className="text-base font-semibold text-text-primary mb-1">{DRIVERS.NO_RESULTS}</p>
            <p className="text-sm text-text-secondary mb-5">{DRIVERS.NO_RESULTS_HINT}</p>
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
            {/* ── Desktop table ── */}
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
                  {paginated.map(driver => {
                    const loadPct = driver.maxLoad > 0
                      ? Math.round((driver.currentLoad / driver.maxLoad) * 100)
                      : 0;
                    const barColor =
                      loadPct === 100 ? 'bg-error' :
                      loadPct >= 50   ? 'bg-warning' : 'bg-primary-light';
                    const isOffline = driver.availability === 'OFFLINE';

                    return (
                      <tr key={driver.id} className="hover:bg-surface-elevated transition-colors">
                        {/* Driver */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-white">{driver.avatarInitials}</span>
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                                {driver.name}
                              </p>
                              <p className="text-xs font-mono text-text-muted">{driver.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact & Vehicle */}
                        <td className="px-5 py-3.5">
                          <p className={`text-sm ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                            {driver.phone}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${isOffline ? 'bg-surface-elevated text-text-muted' : 'bg-primary-subtle text-primary-light'}`}>
                              {driver.vehicle}
                            </span>
                            <span className="text-xs font-mono text-text-muted">{driver.vehiclePlate}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${AVAILABILITY_STYLES[driver.availability].dot}`} />
                            <span className={`text-sm font-medium ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                              {AVAILABILITY_STYLES[driver.availability].label}
                            </span>
                          </div>
                        </td>

                        {/* Current Load */}
                        <td className="px-5 py-3.5 min-w-[150px]">
                          {isOffline ? (
                            <p className="text-sm text-text-muted">
                              {driver.completedToday === 0 ? DRIVERS.IN_ACTIVE : DRIVERS.SHIFT_ENDED}
                            </p>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-text-primary">{driver.currentLoad}/{driver.maxLoad} orders</span>
                                <span className="text-xs text-text-muted">{loadPct}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${loadPct}%` }} />
                              </div>
                            </>
                          )}
                        </td>

                        {/* Completed Today */}
                        <td className="px-5 py-3.5">
                          <span className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                            {driver.completedToday}
                          </span>
                        </td>

                        {/* Avg Delivery Time */}
                        <td className="px-5 py-3.5">
                          <span className={`text-sm ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                            {driver.avgDeliveryTime}
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

            {/* ── Mobile cards ── */}
            <div className="lg:hidden divide-y divide-border">
              {paginated.map(driver => {
                const loadPct = driver.maxLoad > 0
                  ? Math.round((driver.currentLoad / driver.maxLoad) * 100)
                  : 0;
                const barColor =
                  loadPct === 100 ? 'bg-error' :
                  loadPct >= 50   ? 'bg-warning' : 'bg-primary-light';
                const isOffline = driver.availability === 'OFFLINE';

                return (
                  <Link
                    key={driver.id}
                    href={`/drivers/${driver.id}`}
                    className="block px-4 py-4 hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{driver.avatarInitials}</span>
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${AVAILABILITY_STYLES[driver.availability].dot}`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                            {driver.name}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {driver.vehicle} · ★ {driver.rating}
                          </p>
                        </div>
                      </div>
                      <DriverAvailabilityBadge availability={driver.availability} />
                    </div>

                    {/* Capacity bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Capacity</span>
                        <span className="text-xs text-text-muted">{loadPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${loadPct}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">
                          {isOffline ? 'Last Active' : 'Current Load'}
                        </p>
                        <p className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                          {isOffline ? '4h ago' : `${driver.currentLoad} / ${driver.maxLoad} Orders`}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">Avg Time</p>
                        <p className={`text-sm font-semibold ${isOffline ? 'text-text-muted' : 'text-text-primary'}`}>
                          {driver.avgDeliveryTime}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* ── Pagination footer ── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-4">
            <p className="text-xs text-text-secondary shrink-0">
              {DRIVERS.SHOWING(from, to, filtered.length)}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-text-muted">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      p === safePage
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
                disabled={safePage === totalPages}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── FAB — mobile only ── */}
      <button
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg flex items-center justify-center transition-colors z-10 lg:hidden"
        aria-label={DRIVERS.ADD_DRIVER_LABEL}
      >
        <UserRoundPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
