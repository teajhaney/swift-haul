import { MOCK_DRIVERS } from '@/constants/drivers-mock';
import type { DriverDetail, DriverAssignment, DriverActivity, DriverDeliveryRow } from '@/types/driver';

const MOCK_ASSIGNMENTS: Record<string, DriverAssignment[]> = {
  'DRV-00293': [],
  'DRV-00104': [
    {
      orderId: 'SH-K9J2L5W4',
      status: 'IN TRANSIT',
      statusColor: 'blue',
      recipientName: 'James Robert',
      address: '34 Admiralty Way, Lekki Phase 1',
      eta: '15:45',
    },
  ],
  'DRV-00441': [
    {
      orderId: 'SH-K9J2L5W4',
      status: 'IN TRANSIT',
      statusColor: 'blue',
      recipientName: 'James Robert',
      address: '34 Admiralty Way, Lekki Phase 1',
      eta: '15:45',
    },
    {
      orderId: 'SH-U7V3Y9P1',
      status: 'PICKED UP',
      statusColor: 'amber',
      recipientName: 'Linda Grey',
      address: 'Office 402, Mulliner Towers, Ikoyi',
      eta: '16:30',
    },
  ],
  'DRV-00382': [
    {
      orderId: 'SH-8X92K0L',
      status: 'IN TRANSIT',
      statusColor: 'blue',
      recipientName: 'Electronics Bulk Delivery',
      address: '821 High St, Downtown Hub',
      eta: '14:00',
    },
    {
      orderId: 'SH-1P33M5X',
      status: 'ACCEPTED',
      statusColor: 'green',
      recipientName: 'Priority Medical Supplies',
      address: 'Pending pickup from Central Warehouse',
      eta: '16:15',
    },
  ],
};

const MOCK_ACTIVITY: Record<string, DriverActivity[]> = {
  'DRV-00293': [
    { time: '10:45 AM', title: 'Delivered Package', subtitle: 'SH-4K22L9P • Signature received', dotColor: 'green' },
    { time: '09:12 AM', title: 'Picked Up 2 Orders', subtitle: 'Central Logistics Terminal A', dotColor: 'blue' },
    { time: '08:00 AM', title: 'Shift Started', subtitle: 'Daily check-in complete', dotColor: 'gray' },
  ],
  'DRV-00441': [
    { time: '14:20 PM', title: 'Delivered order SH-A8F3X9K2', subtitle: '• Sarah Jenkins', dotColor: 'green' },
    { time: '13:10 PM', title: 'Marked as In Transit', subtitle: '• 34 Admiralty Way', dotColor: 'blue' },
    { time: '12:45 PM', title: 'Order Picked Up', subtitle: '• SH-K9J2L5W4', dotColor: 'amber' },
    { time: '08:00 AM', title: 'Clocked In', subtitle: '• Victoria Island Hub', dotColor: 'gray' },
  ],
};

const MOCK_HISTORY: DriverDeliveryRow[] = [
  { orderId: 'SH-A8F3X9K2', status: 'DELIVERED', recipientName: 'Sarah Jenkins',  recipientAddress: '12 Oakwood St, Lekki',         completedAt: 'Today, 14:20' },
  { orderId: 'SH-M2N9V4L1', status: 'DELIVERED', recipientName: 'Michael Okon',   recipientAddress: '48 Banana Island Rd',            completedAt: 'Today, 11:45' },
  { orderId: 'SH-P5R1Q8Z3', status: 'FAILED',    recipientName: 'Evelyn Shaw',    recipientAddress: 'Avenue 4, Victoria Isla...',      completedAt: 'Yesterday, 17:10' },
  { orderId: 'SH-D2K7B3X9', status: 'DELIVERED', recipientName: 'Daniel Craig',   recipientAddress: 'Plot 12, Ikoyi Estate',           completedAt: 'Yesterday, 15:30' },
  { orderId: 'SH-2N88M4Z',  status: 'DELIVERED', recipientName: 'Aisha Mohammed', recipientAddress: '5 Marina Road, Lagos',            completedAt: 'Apr 12, 02:30 PM' },
  { orderId: 'SH-9W21P6K',  status: 'DELIVERED', recipientName: 'Tunde Bello',    recipientAddress: '23 Allen Ave, Ikeja',             completedAt: 'Apr 12, 11:15 AM' },
  { orderId: 'SH-R4X9M2K1', status: 'DELIVERED', recipientName: 'Grace Adeyemi',  recipientAddress: 'Block 7, Lekki Gardens',          completedAt: 'Apr 11, 16:40' },
  { orderId: 'SH-B3Q7N1Z8', status: 'FAILED',    recipientName: 'Peter Eze',      recipientAddress: 'No. 2, Creek Road',               completedAt: 'Apr 11, 13:00' },
];

function getAssignments(id: string): DriverAssignment[] {
  return MOCK_ASSIGNMENTS[id] ?? [];
}

function getActivity(id: string): DriverActivity[] {
  return MOCK_ACTIVITY[id] ?? [
    { time: '08:00 AM', title: 'Shift Started', subtitle: 'Daily check-in complete', dotColor: 'gray' },
  ];
}

export function getDriverDetail(id: string): DriverDetail | null {
  const base = MOCK_DRIVERS.find(d => d.id === id);
  if (!base) return null;

  const totalDeliveries = base.totalDeliveries;
  const failedDeliveries = Math.round(totalDeliveries * 0.038);
  const successRate = Math.round((1 - failedDeliveries / totalDeliveries) * 1000) / 10;

  return {
    ...base,
    memberSince: 'Oct 12, 2023',
    successRate,
    failedDeliveries,
    failedReason: 'Incorrect address (8)',
    monthlyChange: '+12% this month',
    assignments: getAssignments(id),
    activity: getActivity(id),
    deliveryHistory: MOCK_HISTORY,
    totalHistoryCount: 20,
  };
}
