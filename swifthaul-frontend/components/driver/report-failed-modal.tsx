'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { FAIL_REPORT, FAIL_REASONS } from '@/constants/pod';
import type { FailReason } from '@/types/pod';

interface ReportFailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSubmit?: (failReason: FailReason, notes: string) => void;
  isPending?: boolean;
}

export function ReportFailedModal({ isOpen, onClose, orderId, onSubmit, isPending }: ReportFailedModalProps) {
  const [selected, setSelected] = useState<FailReason | null>(null);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  function handleSubmit() {
    if (!selected) return;
    onSubmit?.(selected, notes);
    setSelected(null);
    setNotes('');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* Panel — stop propagation so clicking inside doesn't close */}
      <div
        className="modal-panel max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-base font-bold text-text-primary">{FAIL_REPORT.TITLE}</h2>
            <p className="text-sm text-text-secondary mt-0.5">{FAIL_REPORT.SUBTITLE}</p>
          </div>
          <button
            onClick={onClose}
            className="icon-btn -mr-1 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body px-5 py-4 space-y-3">
          {/* Order ID hint */}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Order <span className="font-mono text-primary-light">{orderId}</span>
          </p>

          {/* Reason grid — 2-col on desktop, 1-col stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FAIL_REASONS.map(({ key, label, icon: Icon }) => {
              const isActive = selected === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-error bg-error/5 text-error'
                      : 'border-border bg-surface text-text-secondary hover:bg-surface-elevated hover:border-border-strong'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-error/10' : 'bg-surface-elevated'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-error' : 'text-text-muted'}`} />
                  </div>
                  <span className="text-sm font-semibold flex-1">{label}</span>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notes textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">{FAIL_REPORT.NOTES_LABEL}</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={FAIL_REPORT.NOTES_PLACEHOLDER}
              rows={3}
              className="form-input resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            {FAIL_REPORT.CANCEL}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selected || isPending}
            className="flex-1 h-10 rounded-lg bg-error hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            {isPending ? 'Submitting…' : FAIL_REPORT.SUBMIT}
          </button>
        </div>
      </div>
    </div>
  );
}
