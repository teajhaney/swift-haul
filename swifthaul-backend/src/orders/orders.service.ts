import { BadRequestException, Injectable } from '@nestjs/common';
import { Availability, OrderStatus, Prisma, Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { isValidTransition } from './order-state-machine';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderDto } from './dto/update-order.dto';
import type { ListOrdersDto } from './dto/list-orders.dto';
import type { UpdateStatusDto } from './dto/update-status.dto';
import type { AssignDriverDto } from './dto/assign-driver.dto';
import type { UploadPodDto } from './dto/upload-pod.dto';
import type {
  OrderDetail,
  OrderDetailResult,
  OrderListItem,
  OrderListResult,
  OrderTrackingResult,
  PaginatedOrders,
  PublicTrackingResponse,
  UploadedPodFile,
} from './types/order.types';
import {
  CannotDeleteActiveOrderException,
  DriverAtCapacityException,
  DriverNotFoundException,
  DriverUnavailableException,
  ForbiddenResourceException,
  InvalidTransitionException,
  OrderNotFoundException,
  OrderNotEditableException,
  PodAlreadyExistsException,
  ReferenceIdConflictException,
} from '../common/exceptions/domain.exceptions';

const ACTIVE_STATUSES: OrderStatus[] = [
  OrderStatus.ASSIGNED,
  OrderStatus.ACCEPTED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.OUT_FOR_DELIVERY,
];

const IN_PROGRESS_DRIVER_STATUSES: OrderStatus[] = [
  OrderStatus.ACCEPTED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.OUT_FOR_DELIVERY,
];

const EDITABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.ASSIGNED,
  OrderStatus.RESCHEDULED,
];

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // create order
  async create(
    dto: CreateOrderDto,
    dispatcherId: string,
  ): Promise<OrderDetail> {
    const referenceId = await this.generateUniqueReferenceId();

    const order = await this.prisma.order.create({
      data: {
        referenceId,
        dispatcherId,
        senderName: dto.senderName,
        senderPhone: dto.senderPhone,
        recipientName: dto.recipientName,
        recipientPhone: dto.recipientPhone,
        recipientEmail: dto.recipientEmail,
        pickupAddress: dto.pickupAddress,
        pickupLat: dto.pickupLat,
        pickupLng: dto.pickupLng,
        deliveryAddress: dto.deliveryAddress,
        deliveryLat: dto.deliveryLat,
        deliveryLng: dto.deliveryLng,
        packageDescription: dto.packageDescription,
        weightKg: dto.weightKg,
        dimensions: dto.dimensions,
        priority: dto.priority,
        notes: dto.notes,
        scheduledPickupTime: dto.scheduledPickupTime
          ? new Date(dto.scheduledPickupTime)
          : undefined,
        estimatedDelivery: dto.estimatedDelivery
          ? new Date(dto.estimatedDelivery)
          : undefined,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            driverProfile: {
              select: { vehicleType: true, vehiclePlate: true },
            },
          },
        },
        dispatcher: { select: { id: true, name: true } },
        statusLogs: {
          orderBy: { createdAt: 'asc' },
          include: { changedBy: { select: { id: true, name: true } } },
        },
      },
    });

    return this.toOrderDetail(order);
  }

  // list orders
  async findAll(
    query: ListOrdersDto,
    user: JwtPayload,
  ): Promise<PaginatedOrders> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    // Drivers see only their own orders
    if (user.role === Role.DRIVER) {
      where.driverId = user.sub;
    } else if (query.driverId) {
      where.driverId = query.driverId;
    }

    if (query.status) where.status = query.status;

    if (query.dateFrom ?? query.dateTo) {
      const dateFilter: Prisma.DateTimeFilter<'Order'> = {};
      if (query.dateFrom) dateFilter.gte = new Date(query.dateFrom);
      if (query.dateTo) dateFilter.lte = new Date(query.dateTo);
      where.createdAt = dateFilter;
    }

    if (query.search) {
      where.OR = [
        { referenceId: { contains: query.search, mode: 'insensitive' } },
        { senderName: { contains: query.search, mode: 'insensitive' } },
        { recipientName: { contains: query.search, mode: 'insensitive' } },
        { deliveryAddress: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          driver: { select: { id: true, name: true, avatarUrl: true } },
          dispatcher: { select: { id: true, name: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((o) => this.toOrderListItem(o)),
      meta: { total, page, limit },
    };
  }

  // order detail
  async findOne(referenceId: string, user: JwtPayload): Promise<OrderDetail> {
    const order = await this.prisma.order.findUnique({
      where: { referenceId },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            driverProfile: {
              select: { vehicleType: true, vehiclePlate: true },
            },
          },
        },
        dispatcher: { select: { id: true, name: true } },
        statusLogs: {
          orderBy: { createdAt: 'asc' },
          include: { changedBy: { select: { id: true, name: true } } },
        },
      },
    });

    if (!order) throw new OrderNotFoundException();

    if (user.role === Role.DRIVER && order.driverId !== user.sub) {
      throw new ForbiddenResourceException();
    }

    return this.toOrderDetail(order);
  }

  // update order
  async update(referenceId: string, dto: UpdateOrderDto): Promise<OrderDetail> {
    const order = await this.prisma.order.findUnique({
      where: { referenceId },
    });
    if (!order) throw new OrderNotFoundException();

    if (!EDITABLE_STATUSES.includes(order.status)) {
      throw new OrderNotEditableException();
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        senderName: dto.senderName,
        senderPhone: dto.senderPhone,
        recipientName: dto.recipientName,
        recipientPhone: dto.recipientPhone,
        recipientEmail: dto.recipientEmail,
        pickupAddress: dto.pickupAddress,
        pickupLat: dto.pickupLat,
        pickupLng: dto.pickupLng,
        deliveryAddress: dto.deliveryAddress,
        deliveryLat: dto.deliveryLat,
        deliveryLng: dto.deliveryLng,
        packageDescription: dto.packageDescription,
        weightKg: dto.weightKg,
        dimensions: dto.dimensions,
        priority: dto.priority,
        notes: dto.notes,
        scheduledPickupTime: dto.scheduledPickupTime
          ? new Date(dto.scheduledPickupTime)
          : undefined,
        estimatedDelivery: dto.estimatedDelivery
          ? new Date(dto.estimatedDelivery)
          : undefined,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            driverProfile: {
              select: { vehicleType: true, vehiclePlate: true },
            },
          },
        },
        dispatcher: { select: { id: true, name: true } },
        statusLogs: {
          orderBy: { createdAt: 'asc' },
          include: { changedBy: { select: { id: true, name: true } } },
        },
      },
    });

    return this.toOrderDetail(updated);
  }

  // update order status
  async updateStatus(
    referenceId: string,
    dto: UpdateStatusDto,
    user: JwtPayload,
  ): Promise<OrderDetail> {
    const order = await this.prisma.order.findUnique({
      where: { referenceId },
    });
    if (!order) throw new OrderNotFoundException();

    if (user.role === Role.DRIVER && order.driverId !== user.sub) {
      throw new ForbiddenResourceException();
    }

    if (!isValidTransition(order.status, dto.status)) {
      throw new InvalidTransitionException(order.status, dto.status);
    }

    if (user.role === Role.DRIVER && dto.status === OrderStatus.ACCEPTED) {
      const inProgressCount = await this.prisma.order.count({
        where: {
          driverId: user.sub,
          id: { not: order.id },
          status: { in: IN_PROGRESS_DRIVER_STATUSES },
        },
      });
      if (inProgressCount > 0) {
        throw new DriverAtCapacityException();
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: dto.status },
      });

      await tx.orderStatusLog.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: dto.status,
          changedById: user.sub,
          note: dto.note,
        },
      });
    });

    // Phase 3: emit WebSocket event
    // Phase 4: queue email notification

    return this.findOne(referenceId, user);
  }

  // upload proof of delivery
  async uploadPod(
    referenceId: string,
    file: UploadedPodFile,
    dto: UploadPodDto,
    user: JwtPayload,
  ): Promise<{ message: string }> {
    const order = await this.prisma.order.findUnique({
      where: { referenceId },
      select: { id: true, driverId: true, status: true },
    });
    if (!order) throw new OrderNotFoundException();

    if (user.role === Role.DRIVER && order.driverId !== user.sub) {
      throw new ForbiddenResourceException();
    }

    const existingPod = await this.prisma.proofOfDelivery.findUnique({
      where: { orderId: order.id },
      select: { id: true },
    });
    if (existingPod) throw new PodAlreadyExistsException();

    if (!file?.buffer) {
      throw new BadRequestException('Delivery photo is required.');
    }

    const uploadedPhoto = await this.cloudinaryService.uploadStream(
      file.buffer,
      'swifthaul/pod/photos',
    );

    let signatureUrl: string | undefined;
    const signatureBase64 = this.extractBase64Data(dto.signatureDataUrl);
    if (signatureBase64) {
      const signatureBuffer = Buffer.from(signatureBase64, 'base64');
      const uploadedSignature = await this.cloudinaryService.uploadStream(
        signatureBuffer,
        'swifthaul/pod/signatures',
      );
      signatureUrl = uploadedSignature.secure_url;
    }

    await this.prisma.proofOfDelivery.create({
      data: {
        orderId: order.id,
        photoUrl: uploadedPhoto.secure_url,
        signatureUrl,
        signedBy: dto.signedBy,
      },
    });

    return { message: 'Proof of delivery uploaded.' };
  }

  // assign driver
  async assignDriver(
    referenceId: string,
    dto: AssignDriverDto,
    user: JwtPayload,
  ): Promise<OrderDetail> {
    const order = await this.prisma.order.findUnique({
      where: { referenceId },
    });
    if (!order) throw new OrderNotFoundException();

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.RESCHEDULED
    ) {
      throw new InvalidTransitionException(order.status, OrderStatus.ASSIGNED);
    }

    const driver = await this.prisma.user.findFirst({
      where: { id: dto.driverId, role: Role.DRIVER, isActive: true },
      include: { driverProfile: true },
    });

    if (!driver?.driverProfile) throw new DriverNotFoundException();

    if (driver.driverProfile.availability === Availability.OFFLINE) {
      throw new DriverUnavailableException();
    }

    const activeCount = await this.prisma.order.count({
      where: { driverId: dto.driverId, status: { in: ACTIVE_STATUSES } },
    });

    if (activeCount >= driver.driverProfile.maxConcurrentOrders) {
      throw new DriverAtCapacityException();
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { driverId: dto.driverId, status: OrderStatus.ASSIGNED },
      });

      await tx.orderStatusLog.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: OrderStatus.ASSIGNED,
          changedById: user.sub,
          note: dto.note,
        },
      });
    });

    // Phase 3: emit WebSocket event
    // Phase 4: queue email notification

    return this.findOne(referenceId, user);
  }

  // delete order
  async remove(referenceId: string): Promise<{ message: string }> {
    const order = await this.prisma.order.findUnique({
      where: { referenceId },
    });
    if (!order) throw new OrderNotFoundException();

    if (
      order.status !== OrderStatus.DELIVERED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      throw new CannotDeleteActiveOrderException();
    }

    await this.prisma.order.delete({ where: { id: order.id } });
    return { message: 'Order deleted.' };
  }

  // public tracking by token
  async findByTrackingToken(token: string): Promise<PublicTrackingResponse> {
    const order = await this.prisma.order.findUnique({
      where: { trackingToken: token },
      include: {
        driver: {
          select: {
            name: true,
            driverProfile: { select: { vehicleType: true } },
          },
        },
        statusLogs: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) throw new OrderNotFoundException();

    return this.toPublicTracking(order);
  }

  //get unique reference
  private async generateUniqueReferenceId(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let attempt = 0; attempt < 5; attempt++) {
      const suffix = Array.from({ length: 7 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length)),
      ).join('');
      const referenceId = `SH-${suffix}`;
      const exists = await this.prisma.order.findUnique({
        where: { referenceId },
      });
      if (!exists) return referenceId;
    }
    throw new ReferenceIdConflictException();
  }
  //list orders result mapper
  private toOrderListItem(order: OrderListResult): OrderListItem {
    return {
      referenceId: order.referenceId,
      status: order.status,
      priority: order.priority,
      senderName: order.senderName,
      senderPhone: order.senderPhone,
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      deliveryAddress: order.deliveryAddress,
      driver: order.driver
        ? {
            id: order.driver.id,
            name: order.driver.name,
            avatarUrl: order.driver.avatarUrl,
          }
        : null,
      dispatcher: { id: order.dispatcher.id, name: order.dispatcher.name },
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  //order details result mapper
  private toOrderDetail(order: OrderDetailResult): OrderDetail {
    return {
      referenceId: order.referenceId,
      status: order.status,
      priority: order.priority,
      senderName: order.senderName,
      senderPhone: order.senderPhone,
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      recipientEmail: order.recipientEmail,
      deliveryAddress: order.deliveryAddress,
      driver: order.driver
        ? {
            id: order.driver.id,
            name: order.driver.name,
            avatarUrl: order.driver.avatarUrl,
            vehicleType: order.driver.driverProfile?.vehicleType ?? null,
            vehiclePlate: order.driver.driverProfile?.vehiclePlate ?? null,
          }
        : null,
      dispatcher: { id: order.dispatcher.id, name: order.dispatcher.name },
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingToken: order.trackingToken,
      pickupAddress: order.pickupAddress,
      pickupLat: order.pickupLat,
      pickupLng: order.pickupLng,
      deliveryLat: order.deliveryLat,
      deliveryLng: order.deliveryLng,
      packageDescription: order.packageDescription,
      weightKg: order.weightKg,
      dimensions: order.dimensions,
      notes: order.notes,
      scheduledPickupTime: order.scheduledPickupTime,
      failedAttempts: order.failedAttempts,
      maxRetries: order.maxRetries,
      statusLogs: order.statusLogs.map((log) => ({
        id: log.id,
        fromStatus: log.fromStatus,
        toStatus: log.toStatus,
        changedBy: { id: log.changedBy.id, name: log.changedBy.name },
        note: log.note,
        createdAt: log.createdAt,
      })),
    };
  }

  private toPublicTracking(order: OrderTrackingResult): PublicTrackingResponse {
    return {
      referenceId: order.referenceId,
      status: order.status,
      recipientName: order.recipientName,
      deliveryAddress: order.deliveryAddress,
      estimatedDelivery: order.estimatedDelivery,
      driver: order.driver
        ? {
            name: order.driver.name,
            vehicleType: order.driver.driverProfile?.vehicleType ?? null,
          }
        : null,
      statusLogs: order.statusLogs.map((log) => ({
        fromStatus: log.fromStatus,
        toStatus: log.toStatus,
        createdAt: log.createdAt,
      })),
    };
  }

  // extract base64 payload from data url
  private extractBase64Data(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const splitValue = value.split(',');
    return splitValue.length > 1 ? splitValue[1] : undefined;
  }
}
