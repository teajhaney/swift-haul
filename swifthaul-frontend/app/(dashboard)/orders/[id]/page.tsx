'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Package,
  Weight,
  Ruler,
  StickyNote,
  Star,
  Calendar,
  Clock,
  User,
  Truck,
  Loader2,
  Copy,
  ExternalLink,
} from 'lucide-react';

import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { OrderTimeline } from '@/components/orders/order-timeline';
import { OrderMap } from '@/components/orders/order-map';
import { PodViewer } from '@/components/orders/pod-viewer';
import { AssignDriverModal } from '@/components/orders/assign-driver-modal';
import { CancelOrderModal } from '@/components/orders/cancel-order-modal';
import { EditOrderModal } from '@/components/orders/edit-order-modal';
import { ORDER_DETAIL } from '@/constants/order-detail';
import { PRIORITY_STYLES, PRIORITY_LABELS } from '@/constants/orders';
import { useOrder } from '@/hooks/orders/use-order';
import { useUpdateStatus } from '@/hooks/orders/use-update-status';
import { toast } from 'sonner';
import { getInitials, formatDateString } from '@/lib/utils';
import { Section } from '@/components/shared/section';
import { InfoRow } from '@/components/shared/info-row';

type Props = { params: Promise<{ id: string }> };

// ─────────────────────────────────────────────────────────────────────────────

export default function OrderDetailPage({ params }: Props) {
  const { id: referenceId } = use(params);
  const { data: detail, isLoading, isError } = useOrder(referenceId);
  const updateStatus = useUpdateStatus();

  const [modalOpen, setModalOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        {/* Header row */}
        <div className="h-4 w-28 bg-border rounded" />
        <div className="flex items-center gap-3">
          <div className="h-7 w-32 bg-border rounded" />
          <div className="h-6 w-20 bg-border rounded-full" />
          <div className="h-6 w-16 bg-border rounded-full" />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          {/* Left */}
          <div className="space-y-5">
            {[200, 180, 140].map((h, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border shadow-sm p-5">
                <div className="h-3 w-24 bg-surface-elevated rounded mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 bg-surface-elevated rounded" style={{ width: `${60 + j * 10}%` }} />
                  ))}
                </div>
                <div className="mt-4" style={{ height: h - 100 }} />
              </div>
            ))}
          </div>
          {/* Right */}
          <div className="space-y-5">
            {[160, 140].map((h, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border shadow-sm p-5" style={{ height: h }}>
                <div className="h-3 w-20 bg-surface-elevated rounded mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-surface-elevated rounded w-3/4" />
                  <div className="h-4 bg-surface-elevated rounded w-1/2" />
                  <div className="h-4 bg-surface-elevated rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error / Not found ──────────────────────────────────────────────────────
  if (isError || !detail) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="w-12 h-12 text-text-muted mb-4" />
        <h1 className="text-lg font-semibold text-text-primary mb-1">
          {ORDER_DETAIL.NOT_FOUND_HEADING}
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          {ORDER_DETAIL.NOT_FOUND_SUB}
        </p>
        <Link
          href="/orders"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-light text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {ORDER_DETAIL.NOT_FOUND_BACK}
        </Link>
      </div>
    );
  }

  const isEnRoute =
    detail.status === 'IN_TRANSIT' || detail.status === 'OUT_FOR_DELIVERY';

  const canAssign = !['DELIVERED', 'CANCELLED', 'FAILED'].includes(detail.status);

  function handleCancel() {
    updateStatus.mutate(
      { referenceId, status: 'CANCELLED' },
      {
        onSuccess: () => {
          setCancelOpen(false);
          toast.success(`Order ${referenceId} has been cancelled`);
        },
      },
    );
  }

  function copyTrackingLink() {
    if (!detail) return;
    const url = `${window.location.origin}/track/${detail.trackingToken}`;
    const message = ORDER_DETAIL.SHARE_MESSAGE_TEMPLATE
      .replace('{id}', detail.referenceId)
      .replace('{link}', url);

    navigator.clipboard.writeText(message).then(() => {
      toast.success(ORDER_DETAIL.SHARE_LINK_SUCCESS);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-5">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Link
            href="/orders"
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            {ORDER_DETAIL.BACK}
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold font-mono text-text-primary">
              {detail.referenceId}
            </h1>
            <OrderStatusBadge status={detail.status} />
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[detail.priority]}`}
            >
              {PRIORITY_LABELS[detail.priority]}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Tracking link */}
            <button
              onClick={copyTrackingLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-border text-sm font-semibold text-text-primary hover:bg-surface-elevated transition-all active:scale-95 shadow-sm"
            >
              <Copy className="w-4 h-4 text-primary-light" />
              {ORDER_DETAIL.COPY_SHARE_LINK}
            </button>
            <Link
              href={`/track/${detail.trackingToken}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Tracking page
            </Link>

            {/* Action buttons — only for non-terminal orders */}
            {canAssign && (
              <>
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
                >
                  {ORDER_DETAIL.ACTION_EDIT}
                </button>
                <button
                  onClick={() => setCancelOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-200 text-sm font-medium text-error hover:bg-red-50 transition-colors"
                >
                  {ORDER_DETAIL.ACTION_CANCEL}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">
            {/* Order information */}
            <Section title={ORDER_DETAIL.SECTION_ORDER_INFO}>
              <InfoRow
                icon={User}
                label="Sender"
                value={detail.senderName}
              />
              <InfoRow
                icon={Phone}
                label="Sender Phone"
                value={detail.senderPhone}
              />
              <InfoRow
                icon={User}
                label={ORDER_DETAIL.LABEL_RECIPIENT}
                value={detail.recipientName}
              />
              <InfoRow
                icon={Phone}
                label={ORDER_DETAIL.LABEL_PHONE}
                value={detail.recipientPhone}
              />
              {detail.recipientEmail && (
                <InfoRow
                  icon={Mail}
                  label={ORDER_DETAIL.LABEL_EMAIL}
                  value={detail.recipientEmail}
                />
              )}
              <InfoRow
                icon={MapPin}
                label={ORDER_DETAIL.LABEL_PICKUP}
                value={detail.pickupAddress}
              />
              <InfoRow
                icon={MapPin}
                label={ORDER_DETAIL.LABEL_DELIVERY}
                value={detail.deliveryAddress}
              />
              {detail.weightKg != null && (
                <InfoRow
                  icon={Weight}
                  label={ORDER_DETAIL.LABEL_WEIGHT}
                  value={`${detail.weightKg} kg`}
                />
              )}
              {detail.dimensions && (
                <InfoRow
                  icon={Ruler}
                  label={ORDER_DETAIL.LABEL_DIMENSIONS}
                  value={detail.dimensions}
                />
              )}
              <InfoRow
                icon={Package}
                label={ORDER_DETAIL.LABEL_DESCRIPTION}
                value={detail.packageDescription}
              />
              {detail.notes && (
                <InfoRow
                  icon={StickyNote}
                  label={ORDER_DETAIL.LABEL_NOTES}
                  value={detail.notes}
                />
              )}
            </Section>

            {/* Map */}
            <Section title={ORDER_DETAIL.SECTION_MAP}>
              <OrderMap
                pickupAddress={detail.pickupAddress}
                deliveryAddress={detail.deliveryAddress}
                isActive={isEnRoute}
              />
            </Section>

            {/* Timeline */}
            <Section title={ORDER_DETAIL.SECTION_TIMELINE}>
              <OrderTimeline events={detail.timeline} />
            </Section>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-5">
            {/* Order meta */}
            <Section title={ORDER_DETAIL.SECTION_DETAILS}>
              <InfoRow
                icon={Star}
                label={ORDER_DETAIL.LABEL_PRIORITY}
                value={PRIORITY_LABELS[detail.priority]}
              />
              <InfoRow
                icon={Calendar}
                label={ORDER_DETAIL.LABEL_CREATED}
                value={formatDateString(detail.createdAt)}
              />
              <InfoRow
                icon={Clock}
                label={ORDER_DETAIL.LABEL_EST_DELIVERY}
                value={formatDateString(detail.estimatedDelivery)}
              />
            </Section>

            {/* Driver card */}
            <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                  {ORDER_DETAIL.SECTION_DRIVER}
                </h2>
              </div>
              <div className="px-5 py-4">
                {detail.driver ? (
                  <div className="space-y-4">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary-subtle flex items-center justify-center text-sm font-bold text-primary-light shrink-0">
                        {getInitials(detail.driver.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {detail.driver.name}
                        </p>
                        {detail.driver.vehicleType && (
                          <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {detail.driver.vehicleType}
                            {detail.driver.vehiclePlate ? ` · ${detail.driver.vehiclePlate}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reassign button */}
                    {canAssign && (
                      <button
                        onClick={() => setModalOpen(true)}
                        className="w-full py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
                      >
                        {ORDER_DETAIL.REASSIGN_BTN}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-3">
                      <User className="w-5 h-5 text-text-muted" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary mb-1">
                      {ORDER_DETAIL.NO_DRIVER_HEADING}
                    </p>
                    <p className="text-xs text-text-secondary mb-4">
                      {ORDER_DETAIL.NO_DRIVER_SUB}
                    </p>
                    {canAssign && (
                      <button
                        onClick={() => setModalOpen(true)}
                        className="w-full py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
                      >
                        {ORDER_DETAIL.ASSIGN_BTN}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Proof of delivery */}
            {detail.pod && (
              <Section title={ORDER_DETAIL.SECTION_POD}>
                <PodViewer pod={detail.pod} status={detail.status} />
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Assign driver modal */}
      {modalOpen && (
        <AssignDriverModal
          referenceId={referenceId}
          currentDriverId={detail.driver?.id ?? null}
          onSuccess={() => {}}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Cancel order modal */}
      {cancelOpen && (
        <CancelOrderModal
          orderId={detail.referenceId}
          onConfirm={handleCancel}
          onClose={() => setCancelOpen(false)}
        />
      )}

      {/* Edit order modal */}
      {editOpen && (
        <EditOrderModal
          order={detail}
          referenceId={referenceId}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Cancel loading overlay */}
      {updateStatus.isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </>
  );
}
