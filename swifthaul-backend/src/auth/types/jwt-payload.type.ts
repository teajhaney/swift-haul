import { Role } from '@prisma/client';
import type { Request } from 'express';

// Shape of the data encoded inside every access token and refresh token.
export interface JwtPayload {
  sub: string; // user.id (cuid)
  email: string;
  role: Role;
}

// What request.user looks like after the jwt-refresh strategy runs.
// The refresh endpoint reads this to get the raw token for hash comparison.
export interface RefreshTokenRequest extends Request {
  user: {
    refreshToken: string;
    payload: JwtPayload;
  };
}

// Safe user fields returned in API responses — never includes password hashes.
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
  mustResetPassword: boolean;
}
