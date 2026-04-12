'use client';

import Link from 'next/link';
import {
  MapPin,
  Clock,
  Warehouse,
  Navigation,
  ChevronRight,
} from 'lucide-react';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import { MOCK_ACTIVE_DELIVERY } from '@/constants/driver-queue-mock';
import { MOCK_MAP_STOPS } from '@/constants/driver-map-mock';
import { MAP_PIN_STYLES, MAP_STOP_LABEL, MAP_STOP_BADGE } from '@/constants/driver-map';

export default function DriverMapPage() {
  return (
    <>
      <DriverTopbar />

      {/* ── Desktop: side-by-side. Mobile: map on top, list below ── */}
      <div className="flex flex-col sm:flex-row h-[calc(100vh-3.5rem-4rem)]">
        {/* ── Map area ── */}
        <div
          className="relative flex-1 min-h-64 sm:min-h-full"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(203,213,225,0.4) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(203,213,225,0.4) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '24px 24px',
            backgroundColor: '#EEF2F7',
          }}
        >
          {/* Route lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Pickup → active */}
            <line
              x1="22%"
              y1="32%"
              x2="50%"
              y2="48%"
              stroke="#1A6FB5"
              strokeWidth="2"
              strokeDasharray="7 5"
              strokeLinecap="round"
            />
            {/* active → next */}
            <line
              x1="50%"
              y1="48%"
              x2="70%"
              y2="62%"
              stroke="#F27830"
              strokeWidth="2"
              strokeDasharray="7 5"
              strokeLinecap="round"
            />
            {/* next → upcoming 1 */}
            <line
              x1="70%"
              y1="62%"
              x2="78%"
              y2="28%"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
            {/* active → upcoming 2 */}
            <line
              x1="50%"
              y1="48%"
              x2="30%"
              y2="72%"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
          </svg>

          {/* Depot pin */}
          <div className="absolute left-[20%] top-[28%] -translate-x-1/2 -translate-y-full">
            <div className="w-7 h-7 rounded-full bg-success border-2 border-white shadow-lg flex items-center justify-center">
              <Warehouse className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="block text-center text-[9px] font-semibold text-text-secondary mt-0.5 whitespace-nowrap -translate-x-1/4">
              Depot
            </span>
          </div>

          {/* Stop pins */}
          {MOCK_MAP_STOPS.map(stop => (
            <div
              key={stop.referenceId}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: stop.pinX, top: stop.pinY }}
            >
              <div
                className={`rounded-full border-2 flex items-center justify-center ${MAP_PIN_STYLES[stop.status]}`}
              >
                <MapPin className="w-3 h-3 text-white" />
              </div>
              {stop.status === 'active' && (
                <span className="block text-center text-[9px] font-bold text-accent mt-0.5 whitespace-nowrap -translate-x-1/4">
                  Active
                </span>
              )}
            </div>
          ))}

          {/* Legend */}
          <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm rounded-lg border border-border p-2.5 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-success shrink-0" />
              <span className="text-text-secondary">Depot</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-accent shrink-0" />
              <span className="text-text-secondary">Active</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-primary-light shrink-0" />
              <span className="text-text-secondary">Next</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-border-strong shrink-0" />
              <span className="text-text-secondary">Upcoming</span>
            </div>
          </div>

          {/* Navigate button */}
          <Link
            href={`/driver/orders/${MOCK_ACTIVE_DELIVERY.referenceId}`}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-white text-sm font-semibold shadow-lg hover:bg-primary-hover transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Navigate
          </Link>

          <p className="absolute bottom-3 left-3 text-[10px] text-text-muted">
            Leaflet.js Data
          </p>
        </div>

        {/* ── Stop list ── */}
        <div className="w-full sm:w-80 shrink-0 overflow-y-auto bg-surface border-t sm:border-t-0 sm:border-l border-border">
          <div className="p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Today&apos;s Route
            </h2>
            <div className="space-y-2">
              {MOCK_MAP_STOPS.map((stop, idx) => (
                <Link
                  key={stop.referenceId}
                  href={`/driver/orders/${stop.referenceId}`}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-surface-elevated transition-colors group"
                >
                  {/* Stop number */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                      stop.status === 'active'
                        ? 'bg-accent text-white'
                        : 'bg-surface-elevated text-text-muted border border-border'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-[10px] text-text-muted">
                        {stop.referenceId}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${MAP_STOP_BADGE[stop.status]}`}
                      >
                        {MAP_STOP_LABEL[stop.status]}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {stop.recipientName}
                    </p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {stop.address}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-text-muted">
                      <Clock className="w-3 h-3" />
                      <span>{stop.timeWindow}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted shrink-0 self-center group-hover:text-text-secondary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DriverBottomNav />
    </>
  );
}
