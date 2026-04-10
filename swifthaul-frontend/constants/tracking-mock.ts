import type { TrackingOrder, TrackingTimelineEvent } from '@/types/tracking';

export const MOCK_TRACKING_ORDER: TrackingOrder = {
  trackingId:          'SH-A8F3X9K2',
  status:              'IN_TRANSIT',
  recipientName:       'Sarah Jenkins',
  deliveryAddress:     '242 Baker Street, Apartment 4B\nLondon, NW1 6XE',
  packageDescription:  'Fragile Electronics – 1.2kg',
  driverName:          'Michael Ross',
  driverInitials:      'MR',
  driverPhone:         '+44 7911 123456',
  estimatedArrival:    '14:45 PM',
  distanceAway:        '2.4 miles away (8 mins)',
  lastUpdated:         'Updated just now',
};

export const MOCK_TRACKING_TIMELINE: TrackingTimelineEvent[] = [
  {
    label:       'In Transit',
    time:        '10:45 AM',
    note:        'Your driver is heading to your location with your package.',
    isCurrent:   true,
    isCompleted: false,
  },
  {
    label:       'Picked Up',
    time:        '08:30 AM',
    note:        'Package has been collected from the distribution center.',
    isCurrent:   false,
    isCompleted: true,
  },
  {
    label:       'Driver Assigned',
    time:        'Yesterday, 06:15 PM',
    note:        'Michael Ross has been assigned to your delivery.',
    isCurrent:   false,
    isCompleted: true,
  },
  {
    label:       'Order Processed',
    time:        'Yesterday, 04:00 PM',
    note:        'Order confirmed and ready for pickup.',
    isCurrent:   false,
    isCompleted: true,
  },
];
