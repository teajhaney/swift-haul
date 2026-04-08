'use client';

import { ArrowUpRight, Clock } from 'lucide-react';
import { ORDER_FORM } from '@/constants/order-form';

interface RouteVisualizationProps {
  hasPickup:   boolean;
  hasDelivery: boolean;
}

/**
 * Route preview card for the Create Order right panel.
 * Swap the map canvas internals for Leaflet once installed.
 */
export function RouteVisualization({ hasPickup, hasDelivery }: RouteVisualizationProps) {
  const hasRoute = hasPickup && hasDelivery;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">{ORDER_FORM.ROUTE_HEADING}</h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-surface-elevated text-text-muted border border-border">
          {ORDER_FORM.ROUTE_PREVIEW_BADGE}
        </span>
      </div>

      {/* Map + stats */}
      <div className="flex">
        {/* Map canvas */}
        <div
          className="relative flex-1 h-52"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(203,213,225,0.4) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(203,213,225,0.4) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '22px 22px',
            backgroundColor: '#EEF2F7',
          }}
        >
          {/* Route SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            {hasRoute && (
              <line
                x1="30%" y1="20%"
                x2="68%" y2="72%"
                stroke="#1A6FB5"
                strokeWidth="2"
                strokeDasharray="7 5"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Pickup pin (blue) */}
          {hasPickup && (
            <div className="absolute left-[28%] top-[16%] -translate-x-1/2 -translate-y-full">
              <div className="w-6 h-6 rounded-full bg-primary-light border-2 border-white shadow flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          )}

          {/* Delivery pin (green) */}
          {hasDelivery && (
            <div className="absolute left-[68%] top-[72%] -translate-x-1/2 -translate-y-full">
              <div className="w-6 h-6 rounded-full bg-success border-2 border-white shadow flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          )}

          {/* Empty hint */}
          {!hasRoute && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-text-muted text-center px-4">
                Enter pickup and delivery addresses to preview the route
              </p>
            </div>
          )}
        </div>

        {/* Stats column */}
        <div className="flex flex-col divide-y divide-border border-l border-border w-[72px] shrink-0">
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3">
            <ArrowUpRight className="w-4 h-4 text-primary-light mb-0.5" />
            <p className="text-sm font-bold text-text-primary leading-none">{ORDER_FORM.ROUTE_DISTANCE}</p>
            <p className="text-[9px] font-semibold text-text-muted tracking-wider uppercase">{ORDER_FORM.ROUTE_DISTANCE_LABEL}</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3">
            <Clock className="w-4 h-4 text-success mb-0.5" />
            <p className="text-sm font-bold text-text-primary leading-none">{ORDER_FORM.ROUTE_TIME}</p>
            <p className="text-[9px] font-semibold text-text-muted tracking-wider uppercase">{ORDER_FORM.ROUTE_TIME_LABEL}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
