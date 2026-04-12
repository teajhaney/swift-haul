import type { ActiveDelivery, QueueOrder, DriverDeliveryDetail } from '@/types/driver-order';

export const MOCK_ACTIVE_DELIVERY: ActiveDelivery = {
  referenceId: 'SH-a8f3r7v2',
  status: 'OUT_FOR_DELIVERY',
  priority: 'EXPRESS',
  recipientName: 'Sarah Jenkins',
  deliveryAddress: '482 Oakwood Ave, Springfield, IL 62704',
  estimatedDelivery: '14:30',
  distanceMiles: 2.4,
  recipientPhone: '+1 (217) 555-0192',
};

export const MOCK_QUEUE: QueueOrder[] = [
  {
    referenceId:       'SH-782x90k1',
    recipientName: 'Michael Richardson',
    address:       '1294 West Maple St, Industrial District...',
    timeWindow:    '14:30 – 15:00',
    weight:        '1.2kg',
    distanceMi:   '2.4 mi',
  },
  {
    referenceId:       'SH-231a44p9',
    recipientName: 'Elena Gomez',
    address:       '77 North Riverside Dr, East Side...',
    timeWindow:    '15:15 – 15:45',
    weight:        '0.5kg',
    distanceMi:   '5.8 mi',
  },
  {
    referenceId:       'SH-900f21a2',
    recipientName: 'David Chen',
    address:       '502 Liberty Ave, Downtown Plaza...',
    timeWindow:    '16:00 – 16:30',
    weight:        '4.8kg',
    distanceMi:   '0.9 mi',
  },
  {
    referenceId:       'SH-441k77m3',
    recipientName: 'Marcus Williams',
    address:       '800 N Michigan Ave, Streeterville...',
    timeWindow:    '16:45 – 17:15',
    weight:        '2.1kg',
    distanceMi:   '3.1 mi',
  },
  {
    referenceId:       'SH-663p41s6',
    recipientName: 'Rachel Torres',
    address:       '455 N Cityfront Plaza Dr, Near North...',
    timeWindow:    '17:20 – 17:50',
    weight:        '0.8kg',
    distanceMi:   '1.7 mi',
  },
  {
    referenceId:       'SH-329r82e5',
    recipientName: 'Linda Carter',
    address:       '1 S Dearborn St, The Loop...',
    timeWindow:    '17:55 – 18:25',
    weight:        '3.4kg',
    distanceMi:   '0.6 mi',
  },
  {
    referenceId:       'SH-754w63c1',
    recipientName: 'James Okafor',
    address:       '401 N Wabash Ave, River North...',
    timeWindow:    '18:30 – 19:00',
    weight:        '1.9kg',
    distanceMi:   '4.2 mi',
  },
  {
    referenceId:       'SH-117m58z4',
    recipientName: 'Priya Sharma',
    address:       '680 N Lake Shore Dr, Streeterville...',
    timeWindow:    '19:10 – 19:40',
    weight:        '0.4kg',
    distanceMi:   '2.9 mi',
  },
];

export const MOCK_DELIVERY_DETAILS: Record<string, DriverDeliveryDetail> = {
  'SH-a8f3r7v2': {
    referenceId: 'SH-a8f3r7v2',
    status: 'OUT_FOR_DELIVERY',
    priority: 'EXPRESS',
    recipientName: 'Alexander Graham',
    recipientAddress: '842 North Michigan Avenue, Suite 1205, Chicago, IL 60611',
    recipientPhone: '+1 (312) 555-0841',
    deliveryNotes: 'Leave with doorman if not home. Gate code: 4812.',
    senderName: 'City Logistics Hub',
    senderAddress: '2200 S Western Ave, Dock B4, Chicago, IL 60608',
    senderPhone: '+1 (312) 555-0100',
    packageDescription: 'Fragile Electronic Equipment (Servers), 1x Peripheral Bundle. Total Weight: 14.5kg. Handle with care, no stacking above 3 units.',
    estimatedDelivery: 'Today, 2:05 PM',
    createdAt: 'Today, 10:30 AM',
    timeline: [
      { label: 'Picked Up',  time: '12:45 PM', isCompleted: true,  isCurrent: false },
      { label: 'Accepted',   time: '11:20 AM', isCompleted: true,  isCurrent: false },
      { label: 'Assigned',   time: '10:30 AM', isCompleted: true,  isCurrent: false },
      { label: 'Pending',    time: null,        isCompleted: false, isCurrent: true  },
    ],
  },
  'SH-782x90k1': {
    referenceId: 'SH-782x90k1',
    status: 'ASSIGNED',
    priority: 'STANDARD',
    recipientName: 'Michael Richardson',
    recipientAddress: '1294 West Maple St, Industrial District, Springfield, IL 62702',
    recipientPhone: '+1 (217) 555-1823',
    senderName: 'TechHub Distribution Center',
    senderAddress: '501 Commerce Way, North Sector, Springfield, IL 62701',
    senderPhone: '+1 (217) 555-0050',
    packageDescription: 'Office supplies, 3 boxes. Total weight: 1.2kg. Handle with care.',
    estimatedDelivery: 'Today, 3:00 PM',
    createdAt: 'Today, 11:00 AM',
    timeline: [
      { label: 'Picked Up', time: null,        isCompleted: false, isCurrent: false },
      { label: 'Accepted',  time: null,        isCompleted: false, isCurrent: false },
      { label: 'Assigned',  time: '10:45 AM',  isCompleted: true,  isCurrent: true  },
      { label: 'Pending',   time: '10:30 AM',  isCompleted: true,  isCurrent: false },
    ],
  },
};

export const STATUS_COLORS: Record<string, string> = {
  IN_TRANSIT:       'text-primary-light bg-primary-subtle',
  ASSIGNED:         'text-info bg-info/10',
  ACCEPTED:         'text-success bg-success/10',
  PICKED_UP:        'text-warning bg-warning/10',
  OUT_FOR_DELIVERY: 'text-purple-600 bg-purple-50',
  DELIVERED:        'text-success bg-success/10',
  FAILED:           'text-error bg-error/10',
};

export const PRIORITY_COLORS: Record<string, string> = {
  EXPRESS:  'text-accent bg-accent-soft',
  HIGH:     'text-error bg-error/10',
  STANDARD: 'text-text-secondary bg-surface-elevated border border-border',
  LOW:      'text-text-muted bg-surface-elevated border border-border',
};
