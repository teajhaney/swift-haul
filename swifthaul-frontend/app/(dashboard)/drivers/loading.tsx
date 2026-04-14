export default function DriversLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Page header */}
      <div className="space-y-1.5">
        <div className="h-7 w-24 bg-border rounded" />
        <div className="h-4 w-48 bg-border rounded" />
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 h-9 bg-border rounded-lg" />
        <div className="w-36 h-9 bg-border rounded-lg" />
      </div>

      {/* Table card */}
      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-surface-elevated border-b border-border" />

        {/* Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-9 h-9 rounded-full bg-surface-elevated shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-32 bg-surface-elevated rounded" />
                <div className="h-3 w-24 bg-surface-elevated rounded" />
              </div>
              <div className="hidden lg:block h-4 w-24 bg-surface-elevated rounded" />
              <div className="hidden lg:block h-5 w-16 bg-surface-elevated rounded-full" />
              <div className="hidden lg:block h-4 w-12 bg-surface-elevated rounded" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <div className="h-3 w-36 bg-surface-elevated rounded" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-8 h-8 bg-surface-elevated rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
