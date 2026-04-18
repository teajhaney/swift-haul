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

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { UploadPodDto } from './dto/upload-pod.dto';

// Applied to the OrdersController class
export const ApiOrdersController = () => applyDecorators(ApiTags('Orders'));

// POST /orders
export const ApiCreateOrder = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Create a new order (ADMIN, DISPATCHER)' }),
    ApiBody({ type: CreateOrderDto }),
    ApiResponse({ status: 201, description: 'Order created.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
  );

// GET /orders
export const ApiListOrders = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'List orders with filters and pagination',
      description:
        'ADMIN and DISPATCHER see all orders. DRIVER sees only their assigned orders.',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filter by order status',
    }),
    ApiQuery({
      name: 'driverId',
      required: false,
      description: 'Filter by driver (ignored for DRIVER role)',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search referenceId, sender, recipient, or address',
    }),
    ApiQuery({
      name: 'dateFrom',
      required: false,
      description: 'ISO 8601 date — createdAt >= dateFrom',
    }),
    ApiQuery({
      name: 'dateTo',
      required: false,
      description: 'ISO 8601 date — createdAt <= dateTo',
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
    ApiResponse({ status: 200, description: 'Paginated order list.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
  );

// GET /orders/track/:token
export const ApiTrackOrder = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Public order tracking by tracking token',
      description:
        'No authentication required. Returns limited order info safe for customers.',
    }),
    ApiParam({ name: 'token', description: 'trackingToken from the order' }),
    ApiResponse({ status: 200, description: 'Public tracking data.' }),
    ApiResponse({ status: 404, description: 'Token not found.' }),
  );

// GET /orders/:referenceId
export const ApiGetOrder = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Get full order detail by referenceId (e.g. SH-8F3X9K2)',
    }),
    ApiParam({
      name: 'referenceId',
      description: 'Human-readable order reference',
    }),
    ApiResponse({ status: 200, description: 'Order detail with status logs.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({
      status: 403,
      description: "DRIVER accessing another driver's order.",
    }),
    ApiResponse({ status: 404, description: 'Order not found.' }),
  );

// PATCH /orders/:referenceId/status
export const ApiUpdateOrderStatus = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Transition order status',
      description:
        'Validates against the state machine. Returns 422 on invalid transition. ' +
        'DRIVER can only update their own orders.',
    }),
    ApiParam({
      name: 'referenceId',
      description: 'Human-readable order reference',
    }),
    ApiBody({ type: UpdateStatusDto }),
    ApiResponse({
      status: 200,
      description: 'Status updated. Returns updated order.',
    }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({
      status: 403,
      description: "DRIVER accessing another driver's order.",
    }),
    ApiResponse({ status: 404, description: 'Order not found.' }),
    ApiResponse({
      status: 422,
      description: 'Invalid state machine transition.',
    }),
  );

// PATCH /orders/:referenceId
export const ApiUpdateOrder = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Edit order details (ADMIN, DISPATCHER)',
      description:
        'Updates editable fields on an order. Only allowed when the order is PENDING, ASSIGNED, or RESCHEDULED. Does not change order status.',
    }),
    ApiParam({
      name: 'referenceId',
      description: 'Human-readable order reference',
    }),
    ApiBody({ type: UpdateOrderDto }),
    ApiResponse({
      status: 200,
      description: 'Order updated. Returns updated order.',
    }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
    ApiResponse({ status: 404, description: 'Order not found.' }),
    ApiResponse({
      status: 422,
      description: 'Order is not in an editable state.',
    }),
  );

// DELETE /orders/:referenceId
export const ApiDeleteOrder = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Delete an order (ADMIN only)',
      description: 'Only DELIVERED or CANCELLED orders can be deleted.',
    }),
    ApiParam({
      name: 'referenceId',
      description: 'Human-readable order reference',
    }),
    ApiResponse({ status: 200, description: 'Order deleted.' }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
    ApiResponse({ status: 404, description: 'Order not found.' }),
    ApiResponse({
      status: 422,
      description: 'Order is not in a terminal state.',
    }),
  );

// PATCH /orders/:referenceId/assign
export const ApiAssignDriver = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Assign or reassign a driver (ADMIN, DISPATCHER)',
      description:
        'Order must be PENDING or RESCHEDULED. Checks driver availability and capacity.',
    }),
    ApiParam({
      name: 'referenceId',
      description: 'Human-readable order reference',
    }),
    ApiBody({ type: AssignDriverDto }),
    ApiResponse({
      status: 200,
      description: 'Driver assigned. Returns updated order.',
    }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({ status: 403, description: 'Insufficient role.' }),
    ApiResponse({ status: 404, description: 'Order or driver not found.' }),
    ApiResponse({
      status: 422,
      description: 'Driver offline or at max concurrent orders.',
    }),
  );

// POST /orders/:referenceId/pod
export const ApiUploadPod = () =>
  applyDecorators(
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Upload proof of delivery (DRIVER)',
      description:
        'Stores delivery photo/signature URLs for an order assigned to the current driver.',
    }),
    ApiParam({
      name: 'referenceId',
      description: 'Human-readable order reference',
    }),
    ApiBody({ type: UploadPodDto }),
    ApiResponse({
      status: 201,
      description: 'Proof of delivery stored.',
    }),
    ApiResponse({ status: 401, description: 'Not authenticated.' }),
    ApiResponse({
      status: 403,
      description: "DRIVER accessing another driver's order.",
    }),
    ApiResponse({ status: 404, description: 'Order not found.' }),
    ApiResponse({
      status: 422,
      description: 'POD already exists for this order.',
    }),
  );
