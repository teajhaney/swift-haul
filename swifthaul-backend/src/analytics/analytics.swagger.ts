import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Applied to the AnalyticsController class
export const ApiAnalyticsController = () =>
  applyDecorators(ApiTags('Analytics'));

// GET /analytics/stats
export const ApiGetStats = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Get dashboard KPI stats (ADMIN, DISPATCHER)',
      description:
        'Returns totalOrders, pendingOrders, activeOrders, deliveredToday, activeDrivers, and successRate.',
    }),
    ApiResponse({ status: 200, description: 'Dashboard stats.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
  );

// GET /analytics/chart
export const ApiGetChart = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Get delivery chart data (ADMIN, DISPATCHER)',
      description:
        'Returns daily (7d/30d) or weekly (90d) order counts for the current period and the matching previous period.',
    }),
    ApiQuery({ name: 'range', enum: ['7d', '30d', '90d'], required: false }),
    ApiQuery({ name: 'startDate', type: String, required: false, description: 'ISO date string (YYYY-MM-DD) for custom range start' }),
    ApiQuery({ name: 'endDate', type: String, required: false, description: 'ISO date string (YYYY-MM-DD) for custom range end' }),
    ApiResponse({ status: 200, description: 'Chart data points.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
  );

// GET /analytics/status-breakdown
export const ApiGetStatusBreakdown = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Get order status breakdown (ADMIN, DISPATCHER)',
      description:
        'Returns order counts and percentage per status group: Delivered, In Transit, Pending, Exceptions.',
    }),
    ApiResponse({ status: 200, description: 'Status breakdown slices and total.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
  );
