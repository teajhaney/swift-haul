import type { ReactNode } from 'react';
import { DriverLiveTracker } from '@/components/driver/driver-live-tracker';

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-elevated flex flex-col">
      <DriverLiveTracker />
      {/* Scrollable content — bottom padding for mobile nav */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
    </div>
  );
}
