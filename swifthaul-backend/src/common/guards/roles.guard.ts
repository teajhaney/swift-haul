import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ForbiddenResourceException } from '../exceptions/domain.exceptions';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';

// Global guard: checks that the authenticated user has one of the required roles.
// Runs after JwtAuthGuard so request.user is already populated.
// Routes with no @Roles() metadata pass through unchecked.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    if (!req.user || !requiredRoles.includes(req.user.role)) {
      throw new ForbiddenResourceException();
    }

    return true;
  }
}
