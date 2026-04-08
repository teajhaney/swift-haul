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
} from 'lucide-react';

import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { OrderTimeline } from '@/components/orders/order-timeline';
import { OrderMap } from '@/components/orders/order-map';
import { PodViewer } from '@/components/orders/pod-viewer';
import { AssignDriverModal } from '@/components/orders/assign-driver-modal';
import { ORDER_DETAIL } from '@/constants/order-detail';
import { getOrderDetail } from '@/constants/order-detail-mock';
import { PRIORITY_STYLES } from '@/constants/orders-mock';
import type { Driver } from '@/types/order-detail';

type Props = { params: Promise<{ id: string }> };

// ── Shared section card wrapper ───────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <Icon className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-sm font-medium text-text-primary mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const initial = getOrderDetail(id);

  const [detail, setDetail] = useState(initial);
  const [modalOpen, setModalOpen] = useState(false);

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!detail) {
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
  const canAssign = !['DELIVERED', 'CANCELLED', 'FAILED'].includes(
    detail.status
  );

  function handleAssign(driver: Driver) {
    setDetail(prev => (prev ? { ...prev, driver } : prev));
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
              {detail.id}
            </h1>
            <OrderStatusBadge status={detail.status} />
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[detail.priority]}`}
            >
              {detail.priority}
            </span>
          </div>

          {/* Action buttons — only for non-terminal orders */}
          {canAssign && (
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors">
                {ORDER_DETAIL.ACTION_EDIT}
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-red-200 text-sm font-medium text-error hover:bg-red-50 transition-colors">
                {ORDER_DETAIL.ACTION_CANCEL}
              </button>
            </div>
          )}
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">
            {/* Order information */}
            <Section title={ORDER_DETAIL.SECTION_ORDER_INFO}>
              <InfoRow
                icon={User}
                label={ORDER_DETAIL.LABEL_RECIPIENT}
                value={detail.recipient}
              />
              <InfoRow
                icon={Phone}
                label={ORDER_DETAIL.LABEL_PHONE}
                value={detail.recipientPhone}
              />
              <InfoRow
                icon={Mail}
                label={ORDER_DETAIL.LABEL_EMAIL}
                value={detail.recipientEmail}
              />
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
              <InfoRow
                icon={Weight}
                label={ORDER_DETAIL.LABEL_WEIGHT}
                value={detail.weight}
              />
              <InfoRow
                icon={Ruler}
                label={ORDER_DETAIL.LABEL_DIMENSIONS}
                value={detail.dimensions}
              />
              <InfoRow
                icon={Package}
                label={ORDER_DETAIL.LABEL_DESCRIPTION}
                value={detail.description}
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
                value={detail.priority}
              />
              <InfoRow
                icon={Calendar}
                label={ORDER_DETAIL.LABEL_CREATED}
                value={detail.createdAt}
              />
              <InfoRow
                icon={Clock}
                label={ORDER_DETAIL.LABEL_EST_DELIVERY}
                value={detail.estimatedDelivery}
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
                        {detail.driver.avatarInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {detail.driver.name}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${detail.driver.isAvailable ? 'bg-success' : 'bg-border-strong'}`}
                          />
                          {detail.driver.isAvailable
                            ? ORDER_DETAIL.MODAL_AVAILABLE
                            : ORDER_DETAIL.MODAL_BUSY}
                        </p>
                      </div>
                    </div>

                    {/* Driver details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{detail.driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Truck className="w-3.5 h-3.5 shrink-0" />
                        <span>{detail.driver.vehicle}</span>
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
          currentDriverId={detail.driver?.id ?? null}
          onConfirm={handleAssign}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
