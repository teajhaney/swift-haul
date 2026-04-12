import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Used on POST /auth/refresh — validates the refresh token cookie
// instead of the access token. The route is also decorated with @Public()
// so the global JwtAuthGuard does not reject an expired access token first.
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
