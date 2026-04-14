export default function OrderDetailLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-28 bg-border rounded" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-7 w-32 bg-border rounded" />
          <div className="h-6 w-20 bg-border rounded-full" />
          <div className="h-6 w-16 bg-border rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-36 bg-border rounded-lg" />
          <div className="h-8 w-28 bg-border rounded-lg" />
          <div className="h-8 w-20 bg-border rounded-lg" />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Left column — section cards */}
        <div className="space-y-5">
          {/* Order info card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-4">
            <div className="h-3 w-28 bg-surface-elevated rounded" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-0">
                <div className="w-4 h-4 bg-surface-elevated rounded shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-16 bg-surface-elevated rounded" />
                  <div className="h-4 bg-surface-elevated rounded" style={{ width: `${50 + i * 8}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Map card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <div className="h-3 w-20 bg-surface-elevated rounded" />
            </div>
            <div className="h-52 bg-surface-elevated m-5 rounded-lg" />
          </div>

          {/* Timeline card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <div className="h-3 w-20 bg-surface-elevated rounded" />
            </div>
            <div className="px-5 py-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-surface-elevated shrink-0 mt-1" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-24 bg-surface-elevated rounded" />
                    <div className="h-3 w-36 bg-surface-elevated rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Details card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-5 space-y-3">
            <div className="h-3 w-20 bg-surface-elevated rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-0">
                <div className="w-4 h-4 bg-surface-elevated rounded shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-16 bg-surface-elevated rounded" />
                  <div className="h-4 w-24 bg-surface-elevated rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Driver card */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
            <div className="h-3 w-20 bg-surface-elevated rounded mb-4" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-elevated shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-surface-elevated rounded" />
                <div className="h-3 w-20 bg-surface-elevated rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
