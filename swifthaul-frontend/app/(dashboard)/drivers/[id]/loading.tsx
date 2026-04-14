export default function DriverDetailLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-32 bg-border rounded" />

      {/* Two-column layout */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Profile card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="w-20 h-20 rounded-xl bg-surface-elevated shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-7 w-40 bg-surface-elevated rounded" />
                <div className="h-4 w-24 bg-surface-elevated rounded" />
                <div className="grid grid-cols-2 gap-2.5 mt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 bg-surface-elevated rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-3">
                <div className="h-3 w-24 bg-surface-elevated rounded" />
                <div className="h-8 w-16 bg-surface-elevated rounded" />
                <div className="h-3 w-20 bg-surface-elevated rounded" />
              </div>
            ))}
          </div>

          {/* Delivery history card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="h-5 w-32 bg-surface-elevated rounded" />
              <div className="h-4 w-20 bg-surface-elevated rounded" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="h-4 w-24 bg-surface-elevated rounded" />
                  <div className="h-5 w-20 bg-surface-elevated rounded-full" />
                  <div className="h-4 w-32 bg-surface-elevated rounded" />
                  <div className="h-4 w-20 bg-surface-elevated rounded ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full xl:w-80 shrink-0 space-y-5">
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border">
              <div className="h-4 w-32 bg-surface-elevated rounded" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="px-4 py-3 space-y-1.5">
                  <div className="h-3 w-20 bg-surface-elevated rounded" />
                  <div className="h-4 w-28 bg-surface-elevated rounded" />
                  <div className="h-3 w-36 bg-surface-elevated rounded" />
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border">
              <div className="h-10 rounded-lg bg-surface-elevated" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
