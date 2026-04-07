import { TrendingUp, TrendingDown } from 'lucide-react';
import type { KpiData } from '@/types/analytics';

interface KpiCardProps {
  data: KpiData;
}

export function KpiCard({ data }: KpiCardProps) {
  const { label, value, trend, trendPositive, icon: Icon, iconBg, iconColor } = data;

  return (
    <div className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 shadow-sm">
      {/* Icon + trend */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>

        {trend !== undefined ? (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trendPositive ? 'text-success' : 'text-error'}`}>
            {trendPositive
              ? <TrendingUp className="w-3.5 h-3.5" />
              : <TrendingDown className="w-3.5 h-3.5" />
            }
            {trend}
          </span>
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-success mt-1" aria-label="Active" />
        )}
      </div>

      {/* Value + label */}
      <div>
        <p className="text-2xl font-bold text-text-primary leading-none mb-1">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    </div>
  );
}
