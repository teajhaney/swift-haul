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

// ── Pagination Utilities ────────────────────────────────────────────────────

export function getPageNumbers(
  current: number,
  total: number
): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

// ── Constants ───────────────────────────────────────────────────────────────

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  BIKE: 'Bike',
  CAR: 'Car',
  VAN: 'Van',
  TRUCK: 'Truck',
};
