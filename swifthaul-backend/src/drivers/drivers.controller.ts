import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { DriversService } from './drivers.service';
import { ListDriversDto } from './dto/list-drivers.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminOrDispatcher } from '../common/decorators/admin-or-dispatcher.decorator';
import { AdminOnly } from '../common/decorators/admin.decorator';
import { DriverOnly } from '../common/decorators/driver.decorator';
import {
  ApiDriversController,
  ApiListDrivers,
  ApiGetDriver,
  ApiUpdateAvailability,
  ApiUpdateDriver,
  ApiDeleteDriver,
} from './drivers.swagger';

@Controller('drivers')
@ApiDriversController()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  // list drivers
  @Get()
  @AdminOrDispatcher()
  @ApiListDrivers()
  async findAll(@Query() query: ListDriversDto) {
    return this.driversService.findAll(query);
  }

  // driver detail
  @Get(':id')
  @ApiGetDriver()
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.driversService.findOne(id, user);
  }

  // update availability
  @Patch(':id/availability')
  @DriverOnly()
  @ApiUpdateAvailability()
  async updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.driversService.updateAvailability(id, dto, user);
  }

  // update driver profile
  @Patch(':id')
  @DriverOnly()
  @ApiUpdateDriver()
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDriverDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.driversService.update(id, dto, user);
  }

  // delete driver
  @Delete(':id')
  @AdminOnly()
  @ApiDeleteDriver()
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.driversService.remove(id, user);
  }
}
