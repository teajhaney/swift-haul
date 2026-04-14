import { z } from 'zod';
import { ORDER_FORM } from '@/constants/order-form';

// ── Create Order Schema ───────────────────────────────────────────────────────

export const orderSchema = z.object({
  senderName: z.string().min(2, ORDER_FORM.ERR_SENDER_NAME),
  senderPhone: z.string().min(7, ORDER_FORM.ERR_SENDER_PHONE),
  pickupAddress: z.string().min(5, ORDER_FORM.ERR_PICKUP),
  recipientName: z.string().min(2, ORDER_FORM.ERR_NAME),
  recipientEmail: z.string().optional(),
  recipientPhone: z.string().min(7, ORDER_FORM.ERR_RECIP_PHONE),
  deliveryAddress: z.string().min(5, ORDER_FORM.ERR_DELIVERY),
  packageDescription: z.string().min(2, ORDER_FORM.ERR_DESCRIPTION),
  weight: z.string().min(1, ORDER_FORM.ERR_WEIGHT),
  priority: z.enum(['STANDARD', 'EXPRESS', 'SAME_DAY']),
  notes: z.string().optional(),
  scheduledPickupTime: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

// ── Edit Order Schema ─────────────────────────────────────────────────────────

export const editOrderSchema = z.object({
  senderName: z.string().min(1, 'Required'),
  senderPhone: z.string().min(7, 'Enter a valid phone number'),
  recipientName: z.string().min(1, 'Required'),
  recipientPhone: z.string().min(7, 'Enter a valid phone number'),
  recipientEmail: z
    .string()
    .email('Enter a valid email')
    .or(z.literal(''))
    .optional(),
  pickupAddress: z.string().min(5, 'Required'),
  deliveryAddress: z.string().min(5, 'Required'),
  packageDescription: z.string().min(2, 'Required'),
  weightKg: z.string().optional(),
  dimensions: z.string().optional(),
  priority: z.enum(['STANDARD', 'EXPRESS', 'SAME_DAY']),
  notes: z.string().optional(),
});

export type EditOrderFormData = z.infer<typeof editOrderSchema>;
