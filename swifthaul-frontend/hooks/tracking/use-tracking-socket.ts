'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { TrackingLocationEvent } from '@/types/tracking';

export function useTrackingSocket(trackingToken: string | null | undefined) {
  const [event, setEvent] = useState<TrackingLocationEvent | null>(null);

  useEffect(() => {
    if (!trackingToken) {
      return;
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

    const socket = io(`${backendUrl}/tracking`, {
      query: { trackingToken },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('tracking:location', (nextEvent: TrackingLocationEvent) => {
      setEvent(nextEvent);
    });

    return () => {
      socket.disconnect();
    };
  }, [trackingToken]);

  return event;
}
