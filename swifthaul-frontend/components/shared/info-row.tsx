import type { ElementType, ReactNode } from 'react';

interface InfoRowProps {
  icon: ElementType;
  label: string;
  value: ReactNode;
}

export function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <Icon className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-sm font-medium text-text-primary mt-0.5 break-words">
          {value ?? '—'}
        </p>
      </div>
    </div>
  );
}
