import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { COOKIES } from '../../common/constants/auth.constants';
import type { JwtPayload } from '../types/jwt-payload.type';

// Reads the refresh token from the HttpOnly cookie, verifies it with JWT_REFRESH_SECRET.
// passReqToCallback = true so validate() can read the raw token for hash comparison.
// Sets request.user = { refreshToken, payload } — consumed by RefreshTokenRequest type.
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null =>
          (req?.cookies as Record<string, string | undefined>)?.[
            COOKIES.REFRESH_TOKEN
          ] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: JwtPayload,
  ): { refreshToken: string; payload: JwtPayload } {
    const refreshToken =
      (req.cookies as Record<string, string>)[COOKIES.REFRESH_TOKEN] ?? '';
    return { refreshToken, payload };
  }
}
