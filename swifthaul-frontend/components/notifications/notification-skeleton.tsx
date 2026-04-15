export function NotificationSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden border-l-4 border-l-primary-light animate-pulse">
      <div className="divide-y divide-border">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 px-6 py-5">
            <div className="w-10 h-10 rounded-full bg-surface-elevated shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="h-3 w-36 bg-surface-elevated rounded" />
                <div className="h-3 w-12 bg-surface-elevated rounded" />
              </div>
              <div className="h-3 w-full bg-surface-elevated rounded" />
              <div className="h-3 w-3/4 bg-surface-elevated rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
