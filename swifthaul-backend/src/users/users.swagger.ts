import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateUserStatusDto } from './dto/update-user-status.dto';

// Applied to the UsersController class
export const ApiUsersController = () => applyDecorators(ApiTags('Users'));

// GET /users
export const ApiListUsers = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'List all users (ADMIN, DISPATCHER)',
      description:
        'Returns all users across all roles with pagination. Excludes passwordHash and tokens.',
    }),
    ApiQuery({ name: 'role', required: false, description: 'Filter by role (ADMIN | DISPATCHER | DRIVER)' }),
    ApiQuery({ name: 'search', required: false, description: 'Search by name or email' }),
    ApiQuery({ name: 'page', required: false, description: 'Page number (default 1)' }),
    ApiQuery({ name: 'limit', required: false, description: 'Page size (default 20, max 50)' }),
    ApiResponse({ status: 200, description: 'Paginated user list.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'ADMIN or DISPATCHER role required.' }),
  );

// PATCH /users/:id/status
export const ApiSetUserStatus = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Activate or deactivate a user (ADMIN only)',
      description:
        'Sets isActive on the target user. Cannot target self. ' +
        'Deactivating a driver with live orders returns 403. ' +
        'Deactivation immediately invalidates the user\'s session.',
    }),
    ApiParam({ name: 'id', description: 'User ID (cuid)' }),
    ApiBody({ type: UpdateUserStatusDto }),
    ApiResponse({ status: 200, description: 'User status updated. Returns updated user.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'ADMIN role required, or cannot modify self, or driver has active orders.' }),
    ApiResponse({ status: 404, description: 'User not found.' }),
  );

