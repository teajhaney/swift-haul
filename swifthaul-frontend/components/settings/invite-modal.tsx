'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, ClipboardList, Truck } from 'lucide-react';
import { SETTINGS } from '@/constants/settings';
import type { UserRole } from '@/types/settings';

interface InviteModalProps {
  onClose: () => void;
  onSubmit: (email: string, role: UserRole) => void;
  isSubmitting?: boolean;
}

type InviteFormValues = {
  email: string;
  role: UserRole;
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  DISPATCHER: ClipboardList,
  DRIVER: Truck,
};

export function InviteModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}: InviteModalProps) {
  const [role, setRole] = useState<UserRole>('DISPATCHER');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<InviteFormValues>({
    defaultValues: { email: '', role: 'DISPATCHER' },
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  function onFormSubmit(data: InviteFormValues) {
    onSubmit(data.email.trim(), data.role);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="text-lg font-bold text-text-primary">
            {SETTINGS.MODAL_HEADING}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-5 space-y-5">
          {/* Email field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text-primary">
              {SETTINGS.LABEL_EMAIL}
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email address is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address.',
                },
              })}
              placeholder={SETTINGS.EMAIL_PLACEHOLDER}
              className="form-input"
              disabled={isSubmitting || formSubmitting}
            />
            {errors.email ? (
              <p className="field-error">{errors.email.message}</p>
            ) : (
              <p className="text-xs text-text-muted mt-1">
                {SETTINGS.EMAIL_HINT}
              </p>
            )}
          </div>

          {/* Role cards */}
          <div>
            <p className="text-sm font-medium text-text-primary mb-3">
              {SETTINGS.LABEL_ROLE}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SETTINGS.ROLE_OPTIONS.map(opt => {
                const Icon = ROLE_ICONS[opt.value];
                const selected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setRole(opt.value);
                      setValue('role', opt.value);
                    }}
                    className={`relative flex flex-col gap-2 p-4 rounded-xl text-left transition-colors ${
                      selected
                        ? 'border-2 border-primary-light bg-primary-subtle'
                        : 'border border-border hover:border-border-strong hover:bg-surface-elevated'
                    }`}
                  >
                    <span
                      className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selected
                          ? 'border-primary-light'
                          : 'border-border-strong'
                      }`}
                    >
                      {selected && (
                        <span className="w-2 h-2 rounded-full bg-primary-light" />
                      )}
                    </span>
                    <Icon
                      className={`w-5 h-5 ${selected ? 'text-primary-light' : 'text-text-muted'}`}
                    />
                    <div>
                      <p
                        className={`text-sm font-semibold ${selected ? 'text-primary-light' : 'text-text-primary'}`}
                      >
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
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting || formSubmitting}
            >
              {SETTINGS.CANCEL}
            </button>
            <button
              type="button"
              onClick={handleSubmit(onFormSubmit)}
              className="btn-primary"
              disabled={isSubmitting || formSubmitting}
            >
              {isSubmitting || formSubmitting
                ? 'Inviting…'
                : SETTINGS.SEND_INVITE}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
