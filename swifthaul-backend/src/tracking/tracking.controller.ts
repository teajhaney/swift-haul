import { Body, Controller, Post } from '@nestjs/common';

import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DriverOnly } from '../common/decorators/driver.decorator';
import { UpdateLocationDto } from './dto/update-location.dto';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('location')
  @DriverOnly()
  async updateLocation(
    @Body() dto: UpdateLocationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.trackingService.updateLocation(dto, user);
  }
}
