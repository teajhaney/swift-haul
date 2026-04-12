import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// Thin wrapper around ioredis that reads REDIS_URL from ConfigService
// and cleans up the connection when the NestJS app shuts down.
@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(configService: ConfigService) {
    super(configService.getOrThrow<string>('REDIS_URL'));
  }

  onModuleDestroy(): void {
    void this.quit();
  }
}
