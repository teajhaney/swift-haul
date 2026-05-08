import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { OrderNotFoundException } from '../common/exceptions/domain.exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { TrackingGateway } from './tracking.gateway';

const LIVE_TRACKING_STATUSES: OrderStatus[] = [
  OrderStatus.ACCEPTED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.OUT_FOR_DELIVERY,
];

@Injectable()
export class TrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trackingGateway: TrackingGateway,
  ) {}

  async updateLocation(dto: UpdateLocationDto, user: JwtPayload) {
    const order = await this.prisma.order.findFirst({
      where: { referenceId: dto.referenceId, driverId: user.sub },
      select: {
        id: true,
        referenceId: true,
        trackingToken: true,
        driverId: true,
        status: true,
      },
    });

    if (!order) {
      throw new OrderNotFoundException();
    }

    if (!LIVE_TRACKING_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        `Live tracking is not available while order status is ${order.status}.`,
      );
    }

    const locationUpdatedAt = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.driverProfile.update({
        where: { userId: user.sub },
        data: {
          currentLat: dto.lat,
          currentLng: dto.lng,
          locationUpdatedAt,
        },
      });

      await tx.locationPing.create({
        data: {
          orderId: order.id,
          driverId: user.sub,
          lat: dto.lat,
          lng: dto.lng,
          speed: dto.speed,
          heading: dto.heading,
        },
      });
    });

    const event = {
      referenceId: order.referenceId,
      trackingToken: order.trackingToken,
      driverId: order.driverId!,
      lat: dto.lat,
      lng: dto.lng,
      speed: dto.speed ?? null,
      heading: dto.heading ?? null,
      locationUpdatedAt: locationUpdatedAt.toISOString(),
    };

    this.trackingGateway.emitLocationUpdate(event);

    return {
      message: 'Location updated.',
      data: event,
    };
  }
}
