'use client';

import { X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateOrder } from '@/hooks/orders/use-update-order';
import {
  editOrderSchema,
  type EditOrderFormData,
} from '@/lib/validations/orders';
import type { OrderDetail } from '@/types/order-detail';

// ── Zod schema ────────────────────────────────────────────────────────────────
// Moved to lib/validations/orders.ts

interface EditOrderModalProps {
  order: OrderDetail;
  referenceId: string;
  onClose: () => void;
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id?: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-text-secondary mb-1"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}

const INPUT_CLS =
  'w-full h-9 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/20 focus:border-primary-light transition-colors';

export function EditOrderModal({
  order,
  referenceId,
  onClose,
}: EditOrderModalProps) {
  const update = useUpdateOrder(referenceId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditOrderFormData>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      senderName: order.senderName ?? '',
      senderPhone: order.senderPhone ?? '',
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      recipientEmail: order.recipientEmail ?? '',
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      packageDescription: order.packageDescription,
      weightKg: order.weightKg != null ? String(order.weightKg) : '',
      dimensions: order.dimensions ?? '',
      priority: order.priority,
      notes: order.notes ?? '',
    },
  });

  function onSubmit(data: EditOrderFormData) {
    update.mutate(
      {
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        recipientEmail: data.recipientEmail || undefined,
        pickupAddress: data.pickupAddress,
        deliveryAddress: data.deliveryAddress,
        packageDescription: data.packageDescription,
        weightKg: data.weightKg ? parseFloat(data.weightKg) : undefined,
        dimensions: data.dimensions || undefined,
        priority: data.priority,
        notes: data.notes || undefined,
      },
      { onSuccess: onClose }
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit order"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-panel max-w-2xl w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Edit Order
            </h2>
            <p className="text-xs text-text-secondary mt-0.5 font-mono">
              {referenceId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="icon-btn -mr-1 -mt-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-body space-y-5">
            {/* Sender */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Sender
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  id="senderName"
                  label="Sender Name"
                  required
                  error={errors.senderName?.message}
                >
                  <input
                    id="senderName"
                    type="text"
                    className={INPUT_CLS}
                    {...register('senderName')}
                  />
                </Field>
                <Field
                  id="senderPhone"
                  label="Sender Phone"
                  required
                  error={errors.senderPhone?.message}
                >
                  <input
                    id="senderPhone"
                    type="tel"
                    className={INPUT_CLS}
                    {...register('senderPhone')}
                  />
                </Field>
                <Field
                  id="pickupAddress"
                  label="Pickup Address"
                  required
                  error={errors.pickupAddress?.message}
                >
                  <input
                    id="pickupAddress"
                    type="text"
                    className={INPUT_CLS}
                    {...register('pickupAddress')}
                  />
                </Field>
              </div>
            </div>

            {/* Recipient */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Recipient
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  id="recipientName"
                  label="Recipient Name"
                  required
                  error={errors.recipientName?.message}
                >
                  <input
                    id="recipientName"
                    type="text"
                    className={INPUT_CLS}
                    {...register('recipientName')}
                  />
                </Field>
                <Field
                  id="recipientPhone"
                  label="Recipient Phone"
                  required
                  error={errors.recipientPhone?.message}
                >
                  <input
                    id="recipientPhone"
                    type="tel"
                    className={INPUT_CLS}
                    {...register('recipientPhone')}
                  />
                </Field>
                <Field
                  id="recipientEmail"
                  label="Recipient Email"
                  error={errors.recipientEmail?.message}
                >
                  <input
                    id="recipientEmail"
                    type="email"
                    className={INPUT_CLS}
                    {...register('recipientEmail')}
                  />
                </Field>
                <Field
                  id="deliveryAddress"
                  label="Delivery Address"
                  required
                  error={errors.deliveryAddress?.message}
                >
                  <input
                    id="deliveryAddress"
                    type="text"
                    className={INPUT_CLS}
                    {...register('deliveryAddress')}
                  />
                </Field>
              </div>
            </div>

            {/* Package */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Package
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  id="packageDescription"
                  label="Description"
                  required
                  error={errors.packageDescription?.message}
                >
                  <input
                    id="packageDescription"
                    type="text"
                    className={INPUT_CLS}
                    {...register('packageDescription')}
                  />
                </Field>
                <Field
                  id="priority"
                  label="Priority"
                  required
                  error={errors.priority?.message}
                >
                  <select
                    id="priority"
                    className={INPUT_CLS}
                    {...register('priority')}
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express</option>
                    <option value="SAME_DAY">Same Day</option>
                  </select>
                </Field>
                <Field
                  id="weightKg"
                  label="Weight (kg)"
                  error={errors.weightKg?.message}
                >
                  <input
                    id="weightKg"
                    type="text"
                    inputMode="decimal"
                    className={INPUT_CLS}
                    {...register('weightKg')}
                  />
                </Field>
                <Field
                  id="dimensions"
                  label="Dimensions"
                  error={errors.dimensions?.message}
                >
                  <input
                    id="dimensions"
                    type="text"
                    placeholder="e.g. 30 × 20 × 15 cm"
                    className={INPUT_CLS}
                    {...register('dimensions')}
                  />
                </Field>
                <Field id="notes" label="Notes" error={errors.notes?.message}>
                  <input
                    id="notes"
                    type="text"
                    className={INPUT_CLS}
                    {...register('notes')}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={update.isPending}
              className="btn-primary flex items-center gap-1.5"
            >
              {update.isPending && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
