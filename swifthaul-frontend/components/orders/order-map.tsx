'use client';

import { MapPin, Navigation } from 'lucide-react';
import { ORDER_DETAIL } from '@/constants/order-detail';

interface OrderMapProps {
  pickupAddress: string;
  deliveryAddress: string;
  isActive: boolean;  // true when driver is en route
}

/**
 * Map placeholder — swap this component body for a real Leaflet map once
 * `npm install leaflet react-leaflet @types/leaflet` is run.
 * The component signature and import stay the same.
 */
export function OrderMap({ pickupAddress, deliveryAddress, isActive }: OrderMapProps) {
  return (
    <div
      className="relative rounded-lg overflow-hidden border border-border h-64"
      style={{
        backgroundImage: [
          'linear-gradient(rgba(226,232,240,0.45) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(226,232,240,0.45) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '28px 28px',
        backgroundColor: '#F8FAFC',
      }}
    >
      {/* Simulated route line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <line
          x1="25%" y1="75%"
          x2="75%" y2="30%"
          stroke="#1A6FB5"
          strokeWidth="2"
          strokeDasharray="8 5"
          strokeLinecap="round"
        />
      </svg>

      {/* Pickup pin */}
      <div className="absolute left-[22%] top-[68%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
        <div className="bg-success text-white rounded-full p-1.5 shadow-md">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <div className="mt-1 px-2 py-0.5 bg-white border border-border rounded text-[10px] font-semibold text-text-primary shadow-sm whitespace-nowrap max-w-[110px] truncate">
          {ORDER_DETAIL.MAP_PICKUP_LABEL}
        </div>
      </div>

      {/* Delivery pin */}
      <div className="absolute left-[75%] top-[26%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
        <div className="bg-primary-light text-white rounded-full p-1.5 shadow-md">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <div className="mt-1 px-2 py-0.5 bg-white border border-border rounded text-[10px] font-semibold text-text-primary shadow-sm whitespace-nowrap max-w-[110px] truncate">
          {ORDER_DETAIL.MAP_DELIVERY_LABEL}
        </div>
      </div>

      {/* Active driver dot */}
      {isActive && (
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
            <div className="relative w-5 h-5 rounded-full bg-accent shadow-md flex items-center justify-center">
              <Navigation className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Address overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-border px-3 py-2 flex gap-4 text-[11px]">
        <span className="flex items-center gap-1 min-w-0">
          <span className="w-2 h-2 rounded-full bg-success shrink-0" />
          <span className="text-text-secondary truncate">{pickupAddress}</span>
        </span>
        <span className="flex items-center gap-1 min-w-0">
          <span className="w-2 h-2 rounded-full bg-primary-light shrink-0" />
          <span className="text-text-secondary truncate">{deliveryAddress}</span>
        </span>
      </div>

      {/* Placeholder notice */}
      {!isActive && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white/90 border border-border rounded-full text-[10px] text-text-muted whitespace-nowrap shadow-sm">
          {ORDER_DETAIL.MAP_PLACEHOLDER}
        </div>
      )}
    </div>
  );
}
