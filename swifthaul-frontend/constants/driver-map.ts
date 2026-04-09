import type { MapStop } from '@/types/driver-pages';

export const MAP_PIN_STYLES: Record<MapStop['status'], string> = {
  active:   'bg-accent border-white shadow-lg w-8 h-8',
  next:     'bg-primary-light border-white shadow w-6 h-6',
  upcoming: 'bg-border-strong border-white shadow w-5 h-5',
};

export const MAP_STOP_LABEL: Record<MapStop['status'], string> = {
  active:   'In Progress',
  next:     'Next Stop',
  upcoming: 'Upcoming',
};

export const MAP_STOP_BADGE: Record<MapStop['status'], string> = {
  active:   'bg-accent/10 text-accent',
  next:     'bg-info/10 text-info',
  upcoming: 'bg-surface-elevated text-text-muted border border-border',
};
