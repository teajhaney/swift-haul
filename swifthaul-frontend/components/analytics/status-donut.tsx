'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatusSlice } from '@/types/analytics';
import { DASHBOARD } from '@/constants/dashboard';

interface StatusDonutProps {
  data: StatusSlice[];
  total: string;
}

interface DonutTooltipPayload {
  name: string;
  value: number;
}

interface DonutTooltipProps {
  active?: boolean;
  payload?: DonutTooltipPayload[];
}

function CustomTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-text-primary">{name}</p>
      <p className="text-xs text-text-secondary">{value}%</p>
    </div>
  );
}

export function StatusDonut({ data, total }: StatusDonutProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Donut */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-text-primary leading-none">{total}</span>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-text-muted mt-0.5">
            {DASHBOARD.DONUT_CENTER_LABEL}
          </span>
        </div>
      </div>

      {/* Legend */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((slice) => (
          <li key={slice.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-xs text-text-secondary truncate">{slice.name}</span>
            </div>
            <span className="text-xs font-semibold text-text-primary shrink-0">{slice.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
