'use client';

import { AlertTriangle, X } from 'lucide-react';

interface CancelOrderModalProps {
  orderId: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelOrderModal({ orderId, onConfirm, onClose }: CancelOrderModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cancel order"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div className="modal-panel max-w-sm w-full" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-error" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Cancel Order</h2>
              <p className="text-xs text-text-secondary mt-0.5">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn -mr-1 shrink-0" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            Are you sure you want to cancel order{' '}
            <span className="font-mono font-semibold text-text-primary">{orderId}</span>?
            The assigned driver will be notified and the order will be removed from the queue.
          </p>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Keep Order
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 h-10 rounded-lg bg-error hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Yes, Cancel Order
          </button>
        </div>

      </div>
    </div>
  );
}
