// cookie names
export const COOKIES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  JWT_FALLBACK: 'jwt', // legacy fallback checked in jwt.strategy
} as const;

// token lifetimes — seconds for jwt.sign(), milliseconds for cookie maxAge
export const TOKEN_TTL = {
  ACCESS_S: 15 * 60, // 900 s (15 min)
  REFRESH_S: 7 * 24 * 60 * 60, // 604 800 s (7 days)
  ACCESS_MS: 15 * 60 * 1000, // 15 min in ms
  REFRESH_MS: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  REFRESH_DAYS: 7,
} as const;

// how long a refresh token lives in the DB (used to set expiresAt)
export const REFRESH_TOKEN_EXPIRY_MS = TOKEN_TTL.REFRESH_MS;
