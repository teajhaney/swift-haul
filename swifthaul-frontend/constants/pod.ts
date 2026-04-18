import { UserX, MapPinOff, UserMinus, MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FailReason } from '@/types/pod';

// ── Photo step ────────────────────────────────────────────────
export const POD = {
  PAGE_TITLE: 'Proof of Delivery',
  PHOTO_TITLE: 'Proof of Delivery',
  PHOTO_SUBTITLE: 'Take a photo of the delivered package',
  PHOTO_HINT: 'Ensure the shipping label and house number are visible.',
  LIVE_VIEW: 'LIVE VIEW',
  TAKE_PHOTO: 'Take Photo',
  UPLOAD_GALLERY: 'Upload from Gallery',
  PRO_TIP_LABEL: 'PRO TIP',
  PRO_TIP_TEXT:
    'Good lighting helps avoid delivery disputes. Avoid blurry shots or heavy shadows.',
  COMPLETE_NAV: 'COMPLETE DELIVERY',
  REPORT_NAV: 'REPORT ISSUE',
  ORDER_ID_LABEL: 'ORDER ID:',

  // Review step
  REVIEW_TITLE: 'Review Proof of Delivery',
  REVIEW_SUBTITLE: 'Make sure the photo is clear before confirming delivery.',
  BACK_TO_PHOTO: 'Back to Photo',
  CONFIRM_DELIVERY: 'Confirm Delivery',

  // Confirmation step
  CONF_TITLE: 'Delivery Confirmed!',
  CONF_SUBTITLE: 'The proof of delivery has been uploaded to the system.',
  CONF_TRACK_LABEL: 'TRACKING ID',
  CONF_TIME_LABEL: 'TIMESTAMP',
  VIEW_DETAILS: 'View Details',
  BACK_TO_QUEUE: 'Back to Queue',

  // Step dot count
  TOTAL_STEPS: 3,
} as const;

// ── Failed delivery ───────────────────────────────────────────
export const FAIL_REPORT = {
  TITLE: 'Report Failed Delivery',
  SUBTITLE: 'Select the reason for failure',
  NOTES_LABEL: 'Additional notes (optional)',
  NOTES_PLACEHOLDER: 'Provide any specific details about the failed attempt...',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit Failed Report',
} as const;

export const FAIL_REASONS: {
  key: FailReason;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: 'NOT_HOME', label: 'Recipient Not Home', icon: UserX },
  { key: 'WRONG_ADDRESS', label: 'Wrong Address', icon: MapPinOff },
  { key: 'REFUSED', label: 'Recipient Refused', icon: UserMinus },
  { key: 'OTHER', label: 'Other', icon: MoreHorizontal },
];
