import type { DriverAvailability } from '@/types/driver';
import { AVAILABILITY_STYLES } from '@/constants/drivers-mock';

interface DriverAvailabilityBadgeProps {
  availability: DriverAvailability;
}

export function DriverAvailabilityBadge({ availability }: DriverAvailabilityBadgeProps) {
  const { badge, label } = AVAILABILITY_STYLES[availability];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badge}`}>
      {label}
    </span>
  );
}
