import type { MapStop } from '@/types/driver-pages';

export const MOCK_MAP_STOPS: MapStop[] = [
  {
    referenceId: 'SH-a8f3r7v2',
    recipientName: 'Sarah Jenkins',
    address: '482 Oakwood Ave, Springfield, IL 62704',
    timeWindow: 'Est. 14:30',
    status: 'active',
    pinX: '50%',
    pinY: '48%',
  },
  {
    referenceId: 'SH-782x90k1',
    recipientName: 'Michael Richardson',
    address: '1294 West Maple St, Industrial District...',
    timeWindow: '14:30 – 15:00',
    status: 'next',
    pinX: '70%',
    pinY: '62%',
  },
  {
    referenceId: 'SH-231a44p9',
    recipientName: 'Elena Gomez',
    address: '77 North Riverside Dr, East Side...',
    timeWindow: '15:15 – 15:45',
    status: 'upcoming',
    pinX: '78%',
    pinY: '28%',
  },
  {
    referenceId: 'SH-900f21a2',
    recipientName: 'David Chen',
    address: '502 Liberty Ave, Downtown Plaza...',
    timeWindow: '16:00 – 16:30',
    status: 'upcoming',
    pinX: '30%',
    pinY: '72%',
  },
];
