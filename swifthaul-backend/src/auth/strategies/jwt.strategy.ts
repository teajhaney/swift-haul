import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { COOKIES } from '../../common/constants/auth.constants';
import type { JwtPayload } from '../types/jwt-payload.type';

// Reads the access token from the HttpOnly cookie, verifies it with JWT_SECRET,
// and sets request.user = payload so @CurrentUser() can extract it.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null =>
          (req?.cookies as Record<string, string | undefined>)?.[
            COOKIES.ACCESS_TOKEN
          ] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
