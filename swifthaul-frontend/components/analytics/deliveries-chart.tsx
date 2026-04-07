'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { DeliveryChartPoint } from '@/types/analytics';
import { DASHBOARD } from '@/constants/dashboard';

interface DeliveriesChartProps {
  data: DeliveryChartPoint[];
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-text-secondary mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs font-medium" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export function DeliveriesChart({ data }: DeliveriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
        />
        <Line
          type="monotone"
          dataKey="orders"
          name={DASHBOARD.CHART_LINE_THIS}
          stroke="#1A6FB5"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#1A6FB5' }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="lastWeek"
          name={DASHBOARD.CHART_LINE_LAST}
          stroke="#CBD5E1"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
