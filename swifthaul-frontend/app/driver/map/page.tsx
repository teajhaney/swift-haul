'use client';

import Link from 'next/link';
import {
  MapPin,
  Clock,
  Warehouse,
  Navigation,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { DriverTopbar } from '@/components/driver/driver-topbar';
import { DriverBottomNav } from '@/components/driver/driver-bottom-nav';
import {
  MAP_PIN_STYLES,
  MAP_STOP_LABEL,
  MAP_STOP_BADGE,
} from '@/constants/driver-map';
import { useMe } from '@/hooks/auth/use-me';
import { useOrder } from '@/hooks/orders/use-order';
import { useOrders } from '@/hooks/orders/use-orders';
import { useTrackingSocket } from '@/hooks/tracking/use-tracking-socket';
import { formatTime } from '@/lib/utils';
import { getBounds, toMapPoint } from '@/lib/tracking-map';
import type { MapStop } from '@/types/driver-pages';
import type { ApiOrderListItem, OrderStatus } from '@/types/order';

const STATUS_PRIORITY: Record<OrderStatus, number> = {
  PENDING: 0,
  ASSIGNED: 1,
  ACCEPTED: 2,
  PICKED_UP: 3,
  IN_TRANSIT: 4,
  OUT_FOR_DELIVERY: 5,
  DELIVERED: 6,
  FAILED: 6,
  RESCHEDULED: 1,
  CANCELLED: 6,
};

const ACTIVE_STATUSES = [
  'ASSIGNED',
  'ACCEPTED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
].join(',');

const DEFAULT_POINTS = {
  depot: { left: 20, top: 28 },
  truck: { left: 50, top: 48 },
  destination: { left: 70, top: 62 },
};

export default function DriverMapPage() {
  const { data: me } = useMe();
  const { data, isLoading } = useOrders({
    page: 1,
    limit: 10,
    driverId: me?.id,
    statuses: ACTIVE_STATUSES,
  });

  const allOrders: ApiOrderListItem[] = [...(data?.data ?? [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const activeOrder = [...allOrders].sort((a, b) => {
    const statusDelta = STATUS_PRIORITY[b.status] - STATUS_PRIORITY[a.status];
    if (statusDelta !== 0) return statusDelta;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  })[0];

  const queue = allOrders.filter(
    order => order.referenceId !== activeOrder?.referenceId
  );
  const { data: activeOrderDetail } = useOrder(activeOrder?.referenceId ?? '');
  const liveLocationEvent = useTrackingSocket(
    activeOrderDetail?.trackingToken ?? null
  );

  if (!activeOrder && queue.length === 0) {
    return (
      <>
        <DriverTopbar />

        <div className="flex flex-col sm:flex-row h-[calc(100vh-3.5rem-4rem)]">
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
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-xs text-center bg-surface/90 backdrop-blur-sm rounded-2xl border border-border shadow-sm p-5">
                <Truck className="w-8 h-8 text-text-muted mx-auto mb-3" />
                <p className="text-sm font-semibold text-text-primary">
                  No live route in progress
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Your map will activate automatically when you accept or start
                  a delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-80 shrink-0 overflow-y-auto bg-surface border-t sm:border-t-0 sm:border-l border-border">
            <div className="p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Today&apos;s Route
              </h2>
              <div className="rounded-xl border border-border bg-surface-elevated p-4 text-sm text-text-muted">
                No assigned stops yet.
              </div>
            </div>
          </div>
        </div>

        <DriverBottomNav />
      </>
    );
  }

  const depotCoords =
    typeof activeOrderDetail?.pickupLat === 'number' &&
    typeof activeOrderDetail?.pickupLng === 'number'
      ? { lat: activeOrderDetail.pickupLat, lng: activeOrderDetail.pickupLng }
      : null;
  const truckCoords =
    liveLocationEvent?.referenceId === activeOrder?.referenceId
      ? { lat: liveLocationEvent.lat, lng: liveLocationEvent.lng }
      : typeof activeOrderDetail?.driver?.currentLat === 'number' &&
          typeof activeOrderDetail?.driver?.currentLng === 'number'
        ? {
            lat: activeOrderDetail.driver.currentLat,
            lng: activeOrderDetail.driver.currentLng,
          }
        : null;
  const stopGeoPoints = queue
    .slice(0, 3)
    .map(order =>
      typeof order.deliveryLat === 'number' &&
      typeof order.deliveryLng === 'number'
        ? { lat: order.deliveryLat, lng: order.deliveryLng }
        : null
    );
  const destinationCoords =
    typeof activeOrderDetail?.deliveryLat === 'number' &&
    typeof activeOrderDetail?.deliveryLng === 'number'
      ? {
          lat: activeOrderDetail.deliveryLat,
          lng: activeOrderDetail.deliveryLng,
        }
      : null;
  const bounds = getBounds([
    depotCoords,
    truckCoords,
    destinationCoords,
    ...stopGeoPoints,
  ]);
  const depotPoint = toMapPoint(depotCoords, bounds, DEFAULT_POINTS.depot);
  const truckPoint = toMapPoint(truckCoords, bounds, DEFAULT_POINTS.truck);
  const destinationPoint = toMapPoint(
    destinationCoords,
    bounds,
    DEFAULT_POINTS.destination
  );

  const mapStops: MapStop[] = [
    ...(activeOrder
      ? [
          {
            referenceId: activeOrder.referenceId,
            recipientName: activeOrder.recipientName,
            address: activeOrder.deliveryAddress,
            timeWindow: activeOrder.estimatedDelivery
              ? `Est. ${formatTime(activeOrder.estimatedDelivery)}`
              : 'ETA pending',
            status: 'active' as const,
            pinX: `${destinationPoint.left}%`,
            pinY: `${destinationPoint.top}%`,
          },
        ]
      : []),
    ...queue.slice(0, 3).map((order, index) => {
      const fallback =
        index === 0
          ? { left: 78, top: 28 }
          : index === 1
            ? { left: 32, top: 72 }
            : { left: 60, top: 22 };
      const point = toMapPoint(
        typeof order.deliveryLat === 'number' &&
          typeof order.deliveryLng === 'number'
          ? { lat: order.deliveryLat, lng: order.deliveryLng }
          : null,
        bounds,
        fallback
      );

      return {
        referenceId: order.referenceId,
        recipientName: order.recipientName,
        address: order.deliveryAddress,
        timeWindow: order.estimatedDelivery
          ? `Est. ${formatTime(order.estimatedDelivery)}`
          : 'ETA pending',
        status: (index === 0 ? 'next' : 'upcoming') as 'next' | 'upcoming',
        pinX: `${point.left}%`,
        pinY: `${point.top}%`,
      };
    }),
  ];

  return (
    <>
      <DriverTopbar />

      <div className="flex flex-col sm:flex-row h-[calc(100vh-3.5rem-4rem)]">
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
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <line
              x1={`${depotPoint.left}%`}
              y1={`${depotPoint.top}%`}
              x2={`${truckPoint.left}%`}
              y2={`${truckPoint.top}%`}
              stroke="#1A6FB5"
              strokeWidth="2"
              strokeDasharray="7 5"
              strokeLinecap="round"
            />
            <line
              x1={`${truckPoint.left}%`}
              y1={`${truckPoint.top}%`}
              x2={`${destinationPoint.left}%`}
              y2={`${destinationPoint.top}%`}
              stroke="#F27830"
              strokeWidth="2"
              strokeDasharray="7 5"
              strokeLinecap="round"
            />
          </svg>

          <div
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${depotPoint.left}%`, top: `${depotPoint.top}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-success border-2 border-white shadow-lg flex items-center justify-center">
              <Warehouse className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="block text-center text-[9px] font-semibold text-text-secondary mt-0.5 whitespace-nowrap -translate-x-1/4">
              Depot
            </span>
          </div>

          {activeOrder && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${truckPoint.left}%`, top: `${truckPoint.top}%` }}
            >
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-accent opacity-30 animate-ping" />
                <div className="relative w-8 h-8 rounded-full bg-accent border-2 border-white shadow-lg flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          )}

          {mapStops.map(stop => (
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
                  Live Stop
                </span>
              )}
            </div>
          ))}

          <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm rounded-lg border border-border p-2.5 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-success shrink-0" />
              <span className="text-text-secondary">Depot</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-accent shrink-0" />
              <span className="text-text-secondary">Truck</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-primary-light shrink-0" />
              <span className="text-text-secondary">Next stop</span>
            </div>
          </div>

          {activeOrder && (
            <Link
              href={`/driver/orders/${activeOrder.referenceId}`}
              className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light text-white text-sm font-semibold shadow-lg hover:bg-primary-hover transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Link>
          )}

          <p className="absolute bottom-3 left-3 text-[10px] text-text-muted">
            Live order coordinates
          </p>
        </div>

        <div className="w-full sm:w-80 shrink-0 overflow-y-auto bg-surface border-t sm:border-t-0 sm:border-l border-border">
          <div className="p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Today&apos;s Route
            </h2>

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-surface-elevated h-24 animate-pulse"
                  />
                ))}
              </div>
            ) : mapStops.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface-elevated p-4 text-sm text-text-muted">
                No active route to track right now.
              </div>
            ) : (
              <div className="space-y-2">
                {mapStops.map((stop, idx) => (
                  <Link
                    key={stop.referenceId}
                    href={`/driver/orders/${stop.referenceId}`}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-surface-elevated transition-colors group"
                  >
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
            )}
          </div>
        </div>
      </div>

      <DriverBottomNav />
    </>
  );
}
