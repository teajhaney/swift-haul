import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

// @Global so EmailService is injectable across all modules (orders, notifications, etc.)
// without having to re-import EmailModule everywhere.
@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
