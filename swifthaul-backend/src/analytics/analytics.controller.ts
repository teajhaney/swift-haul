import { Controller, Get, Query } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { AdminOrDispatcher } from '../common/decorators/admin-or-dispatcher.decorator';
import { ChartQueryDto } from './dto/chart-query.dto';
import {
  ApiAnalyticsController,
  ApiGetStats,
  ApiGetChart,
  ApiGetStatusBreakdown,
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

  // get delivery chart data
  @Get('chart')
  @AdminOrDispatcher()
  @ApiGetChart()
  async getChartData(@Query() dto: ChartQueryDto) {
    return this.analyticsService.getChartData(dto.range ?? '7d', dto.startDate, dto.endDate);
  }

  // get order status breakdown
  @Get('status-breakdown')
  @AdminOrDispatcher()
  @ApiGetStatusBreakdown()
  async getStatusBreakdown() {
    return this.analyticsService.getStatusBreakdown();
  }
}
