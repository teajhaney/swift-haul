import type { DriverProfileData, DriverAvailabilityStatus } from '@/types/driver-pages';

export const MOCK_DRIVER_PROFILE: DriverProfileData = {
  name:              'John Doe',
  initials:          'JD',
  role:              'Driver',
  vehicle:           'Ford Transit Van',
  vehicleType:       'VAN',
  licensePlate:      'IL-7DRV-2041',
  phone:             '+1 (312) 555-0041',
  email:             'john.doe@swifthaul.com',
  joinedDate:        'March 2025',
  totalDeliveries:   847,
  thisWeek:          23,
  onTimeRate:        96.2,
  rating:            4.9,
  currentStreak:     14,
  availability:      'AVAILABLE',
};

export const AVAILABILITY_OPTIONS: { value: DriverAvailabilityStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'BUSY',      label: 'Busy'      },
  { value: 'OFFLINE',   label: 'Offline'   },
];

export const AVAILABILITY_STYLES: Record<DriverAvailabilityStatus, { active: string; dot: string }> = {
  AVAILABLE: { active: 'bg-success text-white border-success',        dot: 'bg-success'    },
  BUSY:      { active: 'bg-warning text-white border-warning',        dot: 'bg-warning'    },
  OFFLINE:   { active: 'bg-text-muted text-white border-text-muted',  dot: 'bg-text-muted' },
};
