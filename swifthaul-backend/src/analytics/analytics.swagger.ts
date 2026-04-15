import { applyDecorators } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
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
