'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiOrderDetail, TimelineEvent } from '@/types/order-detail';
import type { OrderStatus } from '@/types/order';

interface ApiOrderDetailResponse {
  data: ApiOrderDetail;
}

// Map status values to human-readable timeline labels
const STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  PENDING: 'Order Placed',
  ASSIGNED: 'Driver Assigned',
  ACCEPTED: 'Order Accepted',
  PICKED_UP: 'Package Picked Up',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  FAILED: 'Delivery Failed',
  RESCHEDULED: 'Rescheduled',
  CANCELLED: 'Cancelled',
};

// Build a UI timeline from the backend status logs
function buildTimeline(
  statusLogs: ApiOrderDetail['statusLogs'],
  currentStatus: OrderStatus,
): TimelineEvent[] {
  if (statusLogs.length === 0) {
    return [
      {
        status: 'PENDING' as OrderStatus,
        label: STATUS_LABELS['PENDING'] ?? 'Order Placed',
        timestamp: null,
        isCompleted: false,
        isCurrent: true,
      },
    ];
  }

  return statusLogs.map((log, index) => {
    const isLast = index === statusLogs.length - 1;
    return {
      status: log.toStatus as OrderStatus,
      label: STATUS_LABELS[log.toStatus as OrderStatus] ?? log.toStatus,
      timestamp: log.createdAt,
      note: log.note ?? undefined,
      isCompleted: !isLast,
      isCurrent: isLast && log.toStatus === currentStatus,
    };
  });
}

export function useOrder(referenceId: string) {
  return useQuery({
    queryKey: ['order', referenceId],
    queryFn: async () => {
      const res = await api.get<ApiOrderDetailResponse>(
        `/orders/${referenceId}`,
      );
      const order = res.data.data;

      // Build the UI-shaped OrderDetail from the API response
      return {
        referenceId: order.referenceId,
        status: order.status,
        priority: order.priority,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        senderName: order.senderName,
        senderPhone: order.senderPhone,
        recipientName: order.recipientName,
        recipientPhone: order.recipientPhone,
        recipientEmail: order.recipientEmail,
        pickupAddress: order.pickupAddress,
        deliveryAddress: order.deliveryAddress,
        weightKg: order.weightKg,
        dimensions: order.dimensions,
        packageDescription: order.packageDescription,
        notes: order.notes,
        trackingToken: order.trackingToken,
        driver: order.driver,
        timeline: buildTimeline(order.statusLogs, order.status),
        pod: undefined,
      };
    },
    enabled: Boolean(referenceId),
    staleTime: 30 * 1000,
    retry: false,
  });
}
