import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Applied to the NotificationsController class
export const ApiNotificationsController = () =>
  applyDecorators(ApiTags('Notifications'));

// GET /notifications
export const ApiListNotifications = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'List in-app notifications for the current user',
      description:
        'Returns newest first, paginated. Includes unreadCount in meta. Filter by isRead to show only unread.',
    }),
    ApiQuery({
      name: 'isRead',
      required: false,
      description: 'Filter by read status (true | false)',
    }),
    ApiQuery({ name: 'page', required: false, description: 'Page number (default 1)' }),
    ApiQuery({ name: 'limit', required: false, description: 'Page size (default 20, max 50)' }),
    ApiResponse({ status: 200, description: 'Paginated notification list with unreadCount.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
  );

// PATCH /notifications/read-all
export const ApiMarkAllRead = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Mark all unread notifications as read' }),
    ApiResponse({ status: 200, description: 'Count of notifications marked read.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
  );

// PATCH /notifications/:id/read
export const ApiMarkRead = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Mark a single notification as read' }),
    ApiParam({ name: 'id', description: 'Notification ID (cuid)' }),
    ApiResponse({ status: 200, description: 'Notification marked as read.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 404, description: 'Notification not found.' }),
  );
