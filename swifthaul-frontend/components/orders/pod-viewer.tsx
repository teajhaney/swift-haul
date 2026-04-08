import { ImageIcon, PenLine, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ProofOfDelivery } from '@/types/order-detail';
import type { OrderStatus } from '@/types/order';
import { ORDER_DETAIL } from '@/constants/order-detail';

interface PodViewerProps {
  pod: ProofOfDelivery;
  status: OrderStatus;
}

export function PodViewer({ pod, status }: PodViewerProps) {
  const isDelivered = status === 'DELIVERED';

  return (
    <div className="space-y-4">

      {/* Status banner */}
      <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${
        isDelivered
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      }`}>
        {isDelivered
          ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          : <AlertTriangle className="w-4 h-4 text-error shrink-0" />
        }
        <div>
          <p className={`text-xs font-semibold ${isDelivered ? 'text-green-800' : 'text-red-800'}`}>
            {isDelivered ? 'Successfully Delivered' : 'Delivery Failed'}
          </p>
          <p className={`text-xs mt-0.5 ${isDelivered ? 'text-green-700' : 'text-red-700'}`}>
            {pod.timestamp}
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0">
          <PenLine className="w-4 h-4 text-text-muted" />
        </div>
        <div>
          <p className="text-xs text-text-secondary">{ORDER_DETAIL.POD_SIGNED_BY}</p>
          <p className="text-sm font-semibold text-text-primary">{pod.signedBy}</p>
        </div>
      </div>

      {/* Photo */}
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
          {ORDER_DETAIL.POD_PHOTO}
        </p>
        {pod.hasPhoto ? (
          <div className="w-full h-36 rounded-lg bg-surface-elevated border border-border flex flex-col items-center justify-center gap-2 text-text-muted">
            <ImageIcon className="w-7 h-7" />
            <p className="text-xs">Photo stored in Cloudinary</p>
            <p className="text-[10px] text-text-muted">(Displayed here once backend is connected)</p>
          </div>
        ) : (
          <p className="text-xs text-text-secondary italic">{ORDER_DETAIL.POD_NO_PHOTO}</p>
        )}
      </div>

      {/* Note */}
      {pod.note && (
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
            {ORDER_DETAIL.POD_NOTE}
          </p>
          <p className="text-sm text-text-secondary">{pod.note}</p>
        </div>
      )}

    </div>
  );
}
