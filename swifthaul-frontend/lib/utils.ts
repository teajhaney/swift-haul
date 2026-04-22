import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { VehicleType } from '@/types/driver';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── String Utilities ─────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Date Utilities ──────────────────────────────────────────────────────────

export function formatDate(iso: string): {
  date: string;
  time: string;
} {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function formatDateString(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimestamp(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMemberSince(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

// ── Pagination Utilities ────────────────────────────────────────────────────

export function getPageNumbers(
  current: number,
  total: number,
  visibleCount = 4
): number[] {
  if (total <= visibleCount) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - 1);
  let end = start + visibleCount - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - visibleCount + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// ── Constants ───────────────────────────────────────────────────────────────

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  BIKE: 'Bike',
  CAR: 'Car',
  VAN: 'Van',
  TRUCK: 'Truck',
};
