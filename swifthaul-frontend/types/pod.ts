export type PodStep = 'photo' | 'signature' | 'confirmed';

export type FailReason = 'NOT_HOME' | 'WRONG_ADDRESS' | 'REFUSED' | 'OTHER';

export type PodOrder = {
  orderId: string;
  recipientName: string;
  status: string;
  timestamp: string;
  photoRef: string;
};
