import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { UsersService } from './users.service';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminOnly } from '../common/decorators/admin.decorator';
import { AdminOrDispatcher } from '../common/decorators/admin-or-dispatcher.decorator';
import {
  ApiUsersController,
  ApiListUsers,
  ApiSetUserStatus,
} from './users.swagger';

@Controller('users')
@ApiUsersController()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // list all users
  @Get()
  @AdminOrDispatcher()
  @ApiListUsers()
  async findAll(@Query() query: ListUsersDto) {
    return this.usersService.findAll(query);
  }

  // set user active status (activate or deactivate)
  @Patch(':id/status')
  @AdminOnly()
  @ApiSetUserStatus()
  async setStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.setStatus(id, dto, user.sub);
  }
}
