import type { MapStop } from '@/types/driver-pages';
import { MOCK_ACTIVE_DELIVERY, MOCK_QUEUE } from '@/constants/driver-queue-mock';

export const MOCK_MAP_STOPS: MapStop[] = [
  {
    referenceId:       MOCK_ACTIVE_DELIVERY.referenceId,
    recipientName: MOCK_ACTIVE_DELIVERY.recipientName,
    address:       MOCK_ACTIVE_DELIVERY.deliveryAddress,
    timeWindow:    `Est. ${MOCK_ACTIVE_DELIVERY.estimatedDelivery}`,
    status:        'active',
    pinX:          '50%',
    pinY:          '48%',
  },
  {
    referenceId:       MOCK_QUEUE[0].referenceId,
    recipientName: MOCK_QUEUE[0].recipientName,
    address:       MOCK_QUEUE[0].address,
    timeWindow:    MOCK_QUEUE[0].timeWindow,
    status:        'next',
    pinX:          '70%',
    pinY:          '62%',
  },
  {
    referenceId:       MOCK_QUEUE[1].referenceId,
    recipientName: MOCK_QUEUE[1].recipientName,
    address:       MOCK_QUEUE[1].address,
    timeWindow:    MOCK_QUEUE[1].timeWindow,
    status:        'upcoming',
    pinX:          '78%',
    pinY:          '28%',
  },
  {
    referenceId:       MOCK_QUEUE[2].referenceId,
    recipientName: MOCK_QUEUE[2].recipientName,
    address:       MOCK_QUEUE[2].address,
    timeWindow:    MOCK_QUEUE[2].timeWindow,
    status:        'upcoming',
    pinX:          '30%',
    pinY:          '72%',
  },
];
