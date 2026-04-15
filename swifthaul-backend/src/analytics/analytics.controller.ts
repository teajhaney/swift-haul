import { Controller, Get } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { AdminOrDispatcher } from '../common/decorators/admin-or-dispatcher.decorator';
import {
  ApiAnalyticsController,
  ApiGetStats,
} from './analytics.swagger';

@Controller('analytics')
@ApiAnalyticsController()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // get dashboard stats
  @Get('stats')
  @AdminOrDispatcher()
  @ApiGetStats()
  async getStats() {
    return this.analyticsService.getStats();
  }
}
