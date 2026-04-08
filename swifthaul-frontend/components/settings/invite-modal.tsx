'use client';

import { useState } from 'react';
import { X, ClipboardList, Truck } from 'lucide-react';
import { SETTINGS } from '@/constants/settings';
import type { UserRole } from '@/types/settings';

interface InviteModalProps {
  onClose: () => void;
  onSubmit: (email: string, role: UserRole) => void;
}

const ROLE_ICONS: Record<string, React.ElementType> = {
  DISPATCHER: ClipboardList,
  DRIVER: Truck,
};

export function InviteModal({ onClose, onSubmit }: InviteModalProps) {
  const [email, setEmail]       = useState('');
  const [role, setRole]         = useState<UserRole>('DISPATCHER');
  const [emailError, setEmailError] = useState('');

  function handleSubmit() {
    if (!email.trim()) {
      setEmailError('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    onSubmit(email.trim(), role);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,43,70,0.4)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div className="w-full max-w-lg bg-surface rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-text-primary">{SETTINGS.MODAL_HEADING}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-primary">
              {SETTINGS.LABEL_EMAIL}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(''); }}
              placeholder={SETTINGS.EMAIL_PLACEHOLDER}
              className="form-input"
            />
            {emailError ? (
              <p className="field-error">{emailError}</p>
            ) : (
              <p className="text-xs text-text-muted mt-1">{SETTINGS.EMAIL_HINT}</p>
            )}
          </div>

          {/* Role cards */}
          <div>
            <p className="text-sm font-medium text-text-primary mb-3">{SETTINGS.LABEL_ROLE}</p>
            <div className="grid grid-cols-2 gap-3">
              {SETTINGS.ROLE_OPTIONS.map(opt => {
                const Icon = ROLE_ICONS[opt.value];
                const selected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`relative flex flex-col gap-2 p-4 rounded-xl text-left transition-colors ${
                      selected
                        ? 'border-2 border-primary-light bg-primary-subtle'
                        : 'border border-border hover:border-border-strong hover:bg-surface-elevated'
                    }`}
                  >
                    {/* Radio indicator */}
                    <span className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selected ? 'border-primary-light' : 'border-border-strong'
                    }`}>
                      {selected && <span className="w-2 h-2 rounded-full bg-primary-light" />}
                    </span>

                    <Icon className={`w-5 h-5 ${selected ? 'text-primary-light' : 'text-text-muted'}`} />
                    <div>
                      <p className={`text-sm font-semibold ${selected ? 'text-primary-light' : 'text-text-primary'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 leading-snug">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
            >
              {SETTINGS.CANCEL}
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
            >
              {SETTINGS.SEND_INVITE}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
