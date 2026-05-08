'use client';

import { useEffect, useRef } from 'react';
import api from '@/lib/api';

const SEND_INTERVAL_MS = 8_000;
const MIN_DISTANCE_METERS = 20;

export function useDriverLocationTracking(referenceId: string | null) {
  const lastSentAtRef = useRef(0);
  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!referenceId || typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const now = Date.now();
        const lastCoords = lastCoordsRef.current;
        const movedEnough =
          !lastCoords ||
          getDistanceMeters(lastCoords.lat, lastCoords.lng, lat, lng) >=
            MIN_DISTANCE_METERS;
        const waitedEnough = now - lastSentAtRef.current >= SEND_INTERVAL_MS;

        if (!movedEnough && !waitedEnough) {
          return;
        }

        lastSentAtRef.current = now;
        lastCoordsRef.current = { lat, lng };

        void api.post('/tracking/location', {
          referenceId,
          lat,
          lng,
          speed:
            typeof position.coords.speed === 'number' &&
            Number.isFinite(position.coords.speed)
              ? Math.max(0, position.coords.speed * 3.6)
              : undefined,
          heading:
            typeof position.coords.heading === 'number' &&
            Number.isFinite(position.coords.heading)
              ? position.coords.heading
              : undefined,
        });
      },
      () => undefined,
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        timeout: 10_000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [referenceId]);
}

function getDistanceMeters(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
