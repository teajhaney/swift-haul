import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

// @Global so RedisService is available across all modules without re-importing.
@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
