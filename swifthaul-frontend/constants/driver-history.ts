import { CheckCircle2, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { HistoryFilterTab } from '@/types/driver-pages';

export const HISTORY_PAGE_SIZE = 10;

export const HISTORY_TABS: { key: HistoryFilterTab; label: string }[] = [
  { key: 'today', label: 'Today'      },
  { key: 'week',  label: 'This Week'  },
  { key: 'month', label: 'This Month' },
  { key: 'all',   label: 'All Time'   },
];

export const HISTORY_STATUS_STYLES: Record<'DELIVERED' | 'FAILED', { bg: string; text: string; icon: LucideIcon }> = {
  DELIVERED: { bg: 'bg-success/10', text: 'text-success', icon: CheckCircle2 },
  FAILED:    { bg: 'bg-error/10',   text: 'text-error',   icon: XCircle      },
};
