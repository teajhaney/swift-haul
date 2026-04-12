import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // three tiers: burst (1s), per-minute, sustained — auth endpoints override with stricter limits
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1_000, limit: 20 },
      { name: 'medium', ttl: 60_000, limit: 100 },
      { name: 'long', ttl: 900_000, limit: 1000 },
    ]),

    PrismaModule,
    RedisModule,
    EmailModule,
    AuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // JWT check runs globally — routes opt out with @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Role check runs after JWT — routes add requirements with @Roles() / @AdminOnly() etc.
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
