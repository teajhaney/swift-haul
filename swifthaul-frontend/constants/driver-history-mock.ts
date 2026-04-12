import type { DeliveryHistoryItem } from '@/types/driver-pages';

export const MOCK_DELIVERY_HISTORY: DeliveryHistoryItem[] = [
  {
    referenceId:       'SH-a8f3r7v2',
    date:          'Apr 9, 2026',
    recipientName: 'Alexander Graham',
    address:       '842 N Michigan Ave, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-005p12c3',
    date:          'Apr 9, 2026',
    recipientName: 'Patricia Moore',
    address:       '310 W Superior St, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-774g33k8',
    date:          'Apr 8, 2026',
    recipientName: 'James Walker',
    address:       '1100 S Wabash Ave, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-391b55n1',
    date:          'Apr 8, 2026',
    recipientName: 'Olivia Hernandez',
    address:       '501 N Clark St, Chicago',
    status:        'FAILED',
  },
  {
    referenceId:       'SH-882k14w7',
    date:          'Apr 7, 2026',
    recipientName: 'William Foster',
    address:       '200 E Randolph St, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-220v90j4',
    date:          'Apr 7, 2026',
    recipientName: 'Sophia Chang',
    address:       '730 N Michigan Ave, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-556d72a9',
    date:          'Apr 6, 2026',
    recipientName: 'Daniel Kim',
    address:       '1600 N Damen Ave, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-114z09q5',
    date:          'Apr 6, 2026',
    recipientName: 'Emma Johnson',
    address:       '3100 N Lincoln Ave, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-441k77m3',
    date:          'Apr 5, 2026',
    recipientName: 'Marcus Williams',
    address:       '800 N Michigan Ave, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-663p41s6',
    date:          'Apr 5, 2026',
    recipientName: 'Rachel Torres',
    address:       '455 N Cityfront Plaza Dr, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-887a19d0',
    date:          'Apr 4, 2026',
    recipientName: 'Steven Park',
    address:       '233 S Wacker Dr, Chicago',
    status:        'FAILED',
  },
  {
    referenceId:       'SH-329r82e5',
    date:          'Apr 4, 2026',
    recipientName: 'Linda Carter',
    address:       '1 S Dearborn St, Chicago',
    status:        'DELIVERED',
  },
  {
    referenceId:       'SH-754w63c1',
    date:          'Apr 3, 2026',
    recipientName: 'James Okafor',
    address:       '401 N Wabash Ave, Chicago',
    status:        'DELIVERED',
  },
];

export const HISTORY_STATS = {
  totalDeliveries: 847,
  thisWeek:        23,
  successRate:     96.2,
};
