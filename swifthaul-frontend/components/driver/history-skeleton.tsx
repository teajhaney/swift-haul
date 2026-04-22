export function HistoryStatSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-surface-elevated shrink-0" />
      <div className="space-y-2">
        <div className="h-2.5 w-16 rounded bg-surface-elevated" />
        <div className="h-6 w-10 rounded bg-surface-elevated" />
      </div>
    </div>
  );
}

export function HistoryCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="h-3 w-24 rounded bg-surface-elevated" />
        <div className="h-5 w-20 rounded-full bg-surface-elevated" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-surface-elevated" />
        <div className="h-3 w-full rounded bg-surface-elevated" />
        <div className="h-3 w-4/5 rounded bg-surface-elevated" />
      </div>
      <div className="border-t border-border pt-2 flex items-center justify-between gap-3">
        <div className="h-3 w-14 rounded bg-surface-elevated" />
        <div className="h-3 w-20 rounded bg-surface-elevated" />
      </div>
    </div>
  );
}
