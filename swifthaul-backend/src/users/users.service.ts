import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, Role } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { ListUsersDto } from './dto/list-users.dto';
import type { UpdateUserStatusDto } from './dto/update-user-status.dto';
import type { UserListItem, PaginatedUsers } from './types/user.types';
import {
  CannotModifySelfException,
  ForbiddenResourceException,
  UserNotFoundException,
} from '../common/exceptions/domain.exceptions';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  avatarUrl: true,
  isActive: true,
  inviteAccepted: true,
  createdAt: true,
} as const;

type UserSelectResult = Prisma.UserGetPayload<{ select: typeof USER_SELECT }>;

const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.ASSIGNED,
  OrderStatus.ACCEPTED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.OUT_FOR_DELIVERY,
];

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // list all users
  async findAll(query: ListUsersDto): Promise<PaginatedUsers> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: USER_SELECT,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => this.toUserListItem(u)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // set user active status (deactivate or reactivate)
  async setStatus(
    id: string,
    dto: UpdateUserStatusDto,
    adminId: string,
  ): Promise<UserListItem> {
    if (id === adminId) throw new CannotModifySelfException();

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) throw new UserNotFoundException();

    // Block deactivation of a driver who still has live orders
    if (!dto.isActive && user.role === Role.DRIVER) {
      const activeOrders = await this.prisma.order.count({
        where: { driverId: id, status: { in: ACTIVE_ORDER_STATUSES } },
      });

      if (activeOrders > 0) {
        throw new ForbiddenResourceException();
      }
    }

    const updateData: Prisma.UserUpdateInput = { isActive: dto.isActive };

    // Invalidate the session immediately when deactivating
    if (!dto.isActive) {
      updateData.refreshTokenHash = null;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: USER_SELECT,
    });

    return this.toUserListItem(updated);
  }

  // map prisma user select result to response type
  private toUserListItem(u: UserSelectResult): UserListItem {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      avatarUrl: u.avatarUrl,
      isActive: u.isActive,
      inviteAccepted: u.inviteAccepted,
      createdAt: u.createdAt,
    };
  }
}
