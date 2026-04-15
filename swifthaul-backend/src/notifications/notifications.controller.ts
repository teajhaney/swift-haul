import { Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiNotificationsController,
  ApiListNotifications,
  ApiMarkAllRead,
  ApiMarkRead,
} from './notifications.swagger';

@Controller('notifications')
@ApiNotificationsController()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // list notifications
  @Get()
  @ApiListNotifications()
  async findAll(
    @Query() query: ListNotificationsDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notificationsService.findAll(user.sub, query);
  }

  // mark all as read — must be declared before :id to prevent route collision
  @Patch('read-all')
  @ApiMarkAllRead()
  async markAllRead(@CurrentUser() user: JwtPayload) {
    return this.notificationsService.markAllRead(user.sub);
  }

  // mark one as read
  @Patch(':id/read')
  @ApiMarkRead()
  async markRead(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.notificationsService.markRead(id, user.sub);
  }
}
