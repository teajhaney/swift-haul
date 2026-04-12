import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '../../auth/types/jwt-payload.type';

// Extracts the validated JWT payload from request.user after JwtAuthGuard runs.
// Usage: async myHandler(@CurrentUser() user: JwtPayload)
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const req = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    return req.user;
  },
);
