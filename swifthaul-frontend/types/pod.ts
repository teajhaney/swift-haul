export type PodStep = 'photo' | 'review' | 'confirmed';

export type FailReason = 'NOT_HOME' | 'WRONG_ADDRESS' | 'REFUSED' | 'OTHER';

export type PodOrder = {
  referenceId: string;
  recipientName: string;
  status: string;
  timestamp: string;
  photoRef: string;
};
