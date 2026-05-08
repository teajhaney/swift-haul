'use client';

import { useMe } from '@/hooks/auth/use-me';
import { useOrders } from '@/hooks/orders/use-orders';
import { useDriverLocationTracking } from '@/hooks/tracking/use-driver-location-tracking';

const TRACKING_STATUSES = [
  'ACCEPTED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
].join(',');

export function DriverLiveTracker() {
  const { data: me } = useMe();
  const { data } = useOrders({
    page: 1,
    limit: 10,
    driverId: me?.id,
    statuses: TRACKING_STATUSES,
  });

  const activeReferenceId =
    data?.data
      ?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .at(0)?.referenceId ?? null;

  useDriverLocationTracking(activeReferenceId);

  return null;
}
