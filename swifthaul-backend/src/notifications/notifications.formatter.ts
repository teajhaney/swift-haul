import { NotificationType, OrderStatus } from '@prisma/client';

export interface NotificationContent {
  type: NotificationType;
  title: string;
  body: string;
}

/**
 * NotificationFormatter centralizes the wording and styling of all in-app
 * and system alerts. Uses basic markdown-like syntax:
 * - **text** for bolding
 * - {REF-123} for mono-styled reference IDs
 */
export class NotificationFormatter {
  static orderAssigned(referenceId: string): NotificationContent {
    return {
      type: NotificationType.ORDER_ASSIGNED,
      title: 'New Order Assigned',
      body: `You have been assigned a new order {${referenceId}}. Check your orders list to accept and begin pickup.`,
    };
  }

  static statusChanged(referenceId: string, status: OrderStatus, driverName?: string): NotificationContent {
    let title = 'Status Updated';
    let body = `Order {${referenceId}} is now **${status.replace('_', ' ')}**.`;

    switch (status) {
      case OrderStatus.ACCEPTED:
        title = 'Order Accepted';
        body = `**${driverName || 'The driver'}** has accepted order {${referenceId}}.`;
        break;
      case OrderStatus.PICKED_UP:
        title = 'Shipment Picked Up';
        body = `Order {${referenceId}} has been **picked up** and is in transit.`;
        break;
      case OrderStatus.OUT_FOR_DELIVERY:
        title = 'Out for Delivery';
        body = `Order {${referenceId}} is on the **final leg** of the journey and will be delivered shortly.`;
        break;
      case OrderStatus.DELIVERED:
        title = 'Delivery Completed';
        body = `Great news! Order {${referenceId}} has been successfully **delivered**.`;
        break;
      case OrderStatus.FAILED:
        title = 'Delivery Attempt Failed';
        body = `Issue encountered with order {${referenceId}}. It has been moved to the **resolution queue**.`;
        break;
      case OrderStatus.CANCELLED:
        title = 'Order Cancelled';
        body = `Order {${referenceId}} has been **cancelled** and removed from the active queue.`;
        break;
    }

    return {
      type: NotificationType.STATUS_CHANGED,
      title,
      body,
    };
  }

  static systemAlert(title: string, body: string): NotificationContent {
    return {
      type: NotificationType.SYSTEM_UPDATE,
      title,
      body,
    };
  }
}
