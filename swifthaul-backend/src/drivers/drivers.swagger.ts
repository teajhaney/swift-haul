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

import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

// Applied to the DriversController class
export const ApiDriversController = () => applyDecorators(ApiTags('Drivers'));

// GET /drivers
export const ApiListDrivers = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'List all active drivers (ADMIN, DISPATCHER)',
      description: 'Returns paginated list of drivers with profile stats.',
    }),
    ApiQuery({
      name: 'availability',
      required: false,
      description: 'Filter by availability status',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search by name or email',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (default 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Page size (default 10, max 50)',
    }),
    ApiResponse({ status: 200, description: 'Paginated driver list.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
  );

// GET /drivers/:id
export const ApiGetDriver = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Get driver detail by user id',
      description:
        'ADMIN and DISPATCHER can view any driver. DRIVER can only view their own profile.',
    }),
    ApiParam({ name: 'id', description: 'Driver user id' }),
    ApiResponse({
      status: 200,
      description: 'Driver detail with stats and active order count.',
    }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({
      status: 403,
      description: "DRIVER accessing another driver's profile.",
    }),
    ApiResponse({ status: 404, description: 'Driver not found.' }),
  );

// PATCH /drivers/:id/availability
export const ApiUpdateAvailability = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Update own availability status (DRIVER only)',
      description:
        'A driver can only update their own availability. ADMIN and DISPATCHER cannot call this endpoint.',
    }),
    ApiParam({
      name: 'id',
      description: 'Driver user id (must match authenticated user)',
    }),
    ApiBody({ type: UpdateAvailabilityDto }),
    ApiResponse({
      status: 200,
      description: 'Availability updated. Returns updated driver detail.',
    }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({
      status: 403,
      description: "DRIVER updating another driver's profile.",
    }),
    ApiResponse({ status: 404, description: 'Driver not found.' }),
  );

// PATCH /drivers/:id
export const ApiUpdateDriver = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Update own driver profile (DRIVER only)',
      description:
        'A driver can only update their own profile. ADMIN and DISPATCHER cannot call this endpoint.',
    }),
    ApiParam({
      name: 'id',
      description: 'Driver user id (must match authenticated user)',
    }),
    ApiBody({ type: UpdateDriverDto }),
    ApiResponse({
      status: 200,
      description: 'Profile updated. Returns updated driver detail.',
    }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({
      status: 403,
      description: "DRIVER updating another driver's profile.",
    }),
    ApiResponse({ status: 404, description: 'Driver not found.' }),
  );

// DELETE /drivers/:id
export const ApiDeleteDriver = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Delete driver (ADMIN only)',
      description:
        'ADMIN can delete drivers. Cannot delete drivers with active orders.',
    }),
    ApiParam({ name: 'id', description: 'Driver user id' }),
    ApiResponse({ status: 204, description: 'Driver deleted (soft delete).' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({
      status: 403,
      description: 'Non-admin attempting to delete driver.',
    }),
    ApiResponse({ status: 404, description: 'Driver not found.' }),
    ApiResponse({ status: 409, description: 'Driver has active orders.' }),
  );
