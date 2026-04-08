'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  ChevronRight,
  Loader2,
  User,
  MapPin,
  Flag,
  Package,
  Truck,
  ShoppingCart,
  CalendarDays,
  NotebookPen,
  PlusCircle,
} from 'lucide-react';

import { AddressAutocomplete } from '@/components/orders/address-autocomplete';
import { RouteVisualization } from '@/components/orders/order-form-map';
import { ORDER_FORM, type FormPriority } from '@/constants/order-form';
import {
  generateOrderId,
  MOCK_SUBMIT_DELAY_MS,
} from '@/constants/order-form-mock';

// ── Zod schema ────────────────────────────────────────────────────────────────

const orderSchema = z.object({
  senderName: z.string().min(2, ORDER_FORM.ERR_SENDER_NAME),
  senderPhone: z.string().min(7, ORDER_FORM.ERR_SENDER_PHONE),
  pickupAddress: z.string().min(5, ORDER_FORM.ERR_PICKUP),
  recipient: z.string().min(2, ORDER_FORM.ERR_NAME),
  recipientEmail: z.string().optional(),
  recipientPhone: z.string().min(7, ORDER_FORM.ERR_RECIP_PHONE),
  deliveryAddress: z.string().min(5, ORDER_FORM.ERR_DELIVERY),
  description: z.string().min(2, ORDER_FORM.ERR_DESCRIPTION),
  weight: z.string().min(1, ORDER_FORM.ERR_WEIGHT),
  priority: z.enum(['STANDARD', 'EXPRESS', 'SAME_DAY']),
  additionalInstructions: z.string().optional(),
  scheduledPickupTime: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

// ── Section card ──────────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id?: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-primary mb-1.5"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="field-error mt-1.5">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted mt-1">{hint}</p>}
    </div>
  );
}

// ── Error-aware input className ───────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `form-input ${hasError ? 'border-error focus:border-error focus:ring-error/20' : ''}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function NewOrderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryPinned, setDeliveryPinned] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { priority: 'STANDARD' },
  });

  const watchedPickup   = useWatch({ control, name: 'pickupAddress',   defaultValue: '' });
  const watchedDelivery = useWatch({ control, name: 'deliveryAddress', defaultValue: '' });
  const watchedPriority = useWatch({ control, name: 'priority',        defaultValue: 'STANDARD' });

  async function onSubmit() {
    setIsLoading(true);
    await new Promise<void>(r => setTimeout(r, MOCK_SUBMIT_DELAY_MS));
    toast.success(ORDER_FORM.TOAST_SUCCESS(generateOrderId()));
    router.push('/orders');
  }

  return (
    <div className="space-y-5 pb-8">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-sm text-text-secondary">
        <Link
          href="/orders"
          className="hover:text-text-primary transition-colors"
        >
          {ORDER_FORM.BREADCRUMB_ORDERS}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-medium">
          {ORDER_FORM.BREADCRUMB_NEW}
        </span>
      </nav>

      <h1 className="text-2xl font-bold text-text-primary">
        {ORDER_FORM.PAGE_HEADING}
      </h1>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ════════════════════════ LEFT: Form ════════════════════════ */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* 1 ── Sender Information ── */}
          <Section
            icon={User}
            iconBg="bg-primary-subtle"
            iconColor="text-primary-light"
            title={ORDER_FORM.SECTION_SENDER}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="senderName"
                label={ORDER_FORM.LABEL_SENDER_NAME}
                required
                error={errors.senderName?.message}
              >
                <input
                  id="senderName"
                  type="text"
                  placeholder={ORDER_FORM.PH_SENDER_NAME}
                  aria-invalid={!!errors.senderName}
                  className={inputCls(!!errors.senderName)}
                  {...register('senderName')}
                />
              </Field>

              <Field
                id="senderPhone"
                label={ORDER_FORM.LABEL_SENDER_PHONE}
                required
                error={errors.senderPhone?.message}
              >
                <input
                  id="senderPhone"
                  type="tel"
                  placeholder={ORDER_FORM.PH_SENDER_PHONE}
                  aria-invalid={!!errors.senderPhone}
                  className={inputCls(!!errors.senderPhone)}
                  {...register('senderPhone')}
                />
              </Field>
            </div>

            <Controller
              name="pickupAddress"
              control={control}
              render={({ field, fieldState }) => (
                <AddressAutocomplete
                  id="pickupAddress"
                  label={ORDER_FORM.LABEL_PICKUP}
                  placeholder={ORDER_FORM.PH_PICKUP}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
          </Section>

          {/* 2 ── Recipient Information ── */}
          <Section
            icon={MapPin}
            iconBg="bg-accent-soft"
            iconColor="text-accent"
            title={ORDER_FORM.SECTION_RECIPIENT}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="recipient"
                label={ORDER_FORM.LABEL_RECIPIENT}
                required
                error={errors.recipient?.message}
              >
                <input
                  id="recipient"
                  type="text"
                  placeholder={ORDER_FORM.PH_RECIPIENT}
                  aria-invalid={!!errors.recipient}
                  className={inputCls(!!errors.recipient)}
                  {...register('recipient')}
                />
              </Field>

              <Field id="recipientEmail" label={ORDER_FORM.LABEL_RECIP_EMAIL}>
                <input
                  id="recipientEmail"
                  type="email"
                  placeholder={ORDER_FORM.PH_RECIP_EMAIL}
                  className="form-input"
                  {...register('recipientEmail')}
                />
              </Field>
            </div>

            <Field
              id="recipientPhone"
              label={ORDER_FORM.LABEL_RECIP_PHONE}
              required
              error={errors.recipientPhone?.message}
            >
              <input
                id="recipientPhone"
                type="tel"
                placeholder={ORDER_FORM.PH_RECIP_PHONE}
                aria-invalid={!!errors.recipientPhone}
                className={inputCls(!!errors.recipientPhone)}
                {...register('recipientPhone')}
              />
            </Field>

            <Controller
              name="deliveryAddress"
              control={control}
              render={({ field, fieldState }) => (
                <AddressAutocomplete
                  id="deliveryAddress"
                  label={ORDER_FORM.LABEL_DELIVERY}
                  placeholder={ORDER_FORM.PH_DELIVERY}
                  InputIcon={Flag}
                  value={field.value ?? ''}
                  onChange={val => {
                    field.onChange(val);
                    if (deliveryPinned) setDeliveryPinned(false);
                  }}
                  onBlur={field.onBlur}
                  onSelect={val => {
                    field.onChange(val);
                    setDeliveryPinned(true);
                  }}
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
          </Section>

          {/* 3 ── Package Details ── */}
          <Section
            icon={Package}
            iconBg="bg-primary-subtle"
            iconColor="text-primary-light"
            title={ORDER_FORM.SECTION_PACKAGE}
          >
            {/* Description + Weight */}
            <div className="grid grid-cols-[1fr_110px] gap-4 items-start">
              <Field
                id="description"
                label={ORDER_FORM.LABEL_DESCRIPTION}
                required
                error={errors.description?.message}
              >
                <textarea
                  id="description"
                  rows={2}
                  placeholder={ORDER_FORM.PH_DESCRIPTION}
                  aria-invalid={!!errors.description}
                  className={`form-input resize-none ${errors.description ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                  {...register('description')}
                />
              </Field>

              <Field
                id="weight"
                label={ORDER_FORM.LABEL_WEIGHT}
                required
                error={errors.weight?.message}
              >
                <input
                  id="weight"
                  type="text"
                  inputMode="decimal"
                  placeholder={ORDER_FORM.PH_WEIGHT}
                  aria-invalid={!!errors.weight}
                  className={inputCls(!!errors.weight)}
                  {...register('weight')}
                />
              </Field>
            </div>

            {/* Priority */}
            <div>
              <p className="text-sm font-medium text-text-primary mb-2.5">
                {ORDER_FORM.LABEL_PRIORITY}
                <span className="text-error ml-0.5">*</span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                {ORDER_FORM.PRIORITY_OPTIONS.map(
                  ({ value, label, description, Icon }) => {
                    const isSelected = watchedPriority === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setValue('priority', value as FormPriority, {
                            shouldValidate: true,
                          })
                        }
                        className={`flex flex-col gap-2 p-3 rounded-xl border-2 text-left transition-colors ${
                          isSelected
                            ? 'border-primary-light/40 bg-primary-subtle'
                            : 'border-border hover:bg-surface-elevated'
                        }`}
                      >
                        {/* Icon row + radio */}
                        <div className="flex items-center justify-between">
                          <Icon
                            className={`w-4 h-4 ${isSelected ? 'text-primary-light' : 'text-text-muted'}`}
                          />
                          {/* Radio circle */}
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-primary-light bg-primary-light'
                                : 'border-border-strong'
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${isSelected ? 'text-primary-light' : 'text-text-primary'}`}
                          >
                            {label}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {description}
                          </p>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </Section>

          {/* 4 ── Additional ── */}
          <div className="bg-surface rounded-xl border border-border shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="additionalInstructions"
                label={ORDER_FORM.LABEL_INSTRUCTIONS}
              >
                <textarea
                  id="additionalInstructions"
                  rows={3}
                  placeholder={ORDER_FORM.PH_INSTRUCTIONS}
                  className="form-input resize-none"
                  {...register('additionalInstructions')}
                />
              </Field>

              <Field
                id="scheduledPickupTime"
                label={ORDER_FORM.LABEL_PICKUP_TIME}
                hint={ORDER_FORM.PICKUP_TIME_HINT}
              >
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <input
                    id="scheduledPickupTime"
                    type="datetime-local"
                    className="form-input pl-9 text-text-secondary"
                    {...register('scheduledPickupTime')}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              {isLoading ? ORDER_FORM.BTN_LOADING : ORDER_FORM.BTN_SUBMIT}
            </button>
            <Link
              href="/orders"
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
            >
              {ORDER_FORM.BTN_CANCEL}
            </Link>
          </div>
        </form>

        {/* ════════════════════════ RIGHT: Panel ════════════════════════ */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* Route Visualization */}
          <RouteVisualization
            hasPickup={watchedPickup.length > 3}
            hasDelivery={watchedDelivery.length > 3}
          />

          {/* Delivery Estimate */}
          <div className="bg-primary rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 text-accent" />
              <p className="text-sm text-white/70">
                {ORDER_FORM.ESTIMATE_HEADING}
              </p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-bold text-white leading-none">
                  {ORDER_FORM.ESTIMATE_AMOUNT}
                </p>
                <p className="text-xs text-white/50 mt-1.5">
                  {ORDER_FORM.ESTIMATE_SUB}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[9px] font-semibold tracking-widest uppercase text-white/40">
                  {ORDER_FORM.ESTIMATE_REF_LABEL}
                </p>
                <p className="text-xs font-mono text-white/80 mt-0.5">
                  {ORDER_FORM.ESTIMATE_REF_VALUE}
                </p>
              </div>
            </div>
          </div>

          {/* Available Drivers */}
          <div className="bg-surface rounded-xl border border-border shadow-sm px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-text-muted" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                  {ORDER_FORM.DRIVERS_COUNT}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {ORDER_FORM.DRIVERS_SUB}
                </p>
              </div>
            </div>
            <button className="text-sm font-semibold text-primary-light hover:underline shrink-0">
              {ORDER_FORM.DRIVERS_LINK}
            </button>
          </div>

          {/* Mobile-only: notes reminder */}
          <div className="lg:hidden bg-surface rounded-xl border border-border shadow-sm p-4 flex items-start gap-3">
            <NotebookPen className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
            <p className="text-xs text-text-secondary">
              Add any gate codes, access instructions, or special handling notes
              in the Additional Instructions field above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
