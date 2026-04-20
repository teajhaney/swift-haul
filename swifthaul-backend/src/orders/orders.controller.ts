import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersDto } from './dto/list-orders.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UploadPodDto } from './dto/upload-pod.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminOnly } from '../common/decorators/admin.decorator';
import { AdminOrDispatcher } from '../common/decorators/admin-or-dispatcher.decorator';
import { Public } from '../common/decorators/public.decorator';
import {
  ApiOrdersController,
  ApiCreateOrder,
  ApiListOrders,
  ApiTrackOrder,
  ApiGetOrder,
  ApiUpdateOrder,
  ApiAssignDriver,
  ApiDeleteOrder,
  ApiUploadPod,
  ApiUpdateOrderStatus,
} from './orders.swagger';
import type { UploadedPodFile } from './types/order.types';

@Controller('orders')
@ApiOrdersController()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // create order
  @Post()
  @AdminOrDispatcher()
  @ApiCreateOrder()
  async create(@Body() dto: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    return this.ordersService.create(dto, user.sub);
  }

  // list orders
  @Get()
  @ApiListOrders()
  async findAll(
    @Query() query: ListOrdersDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.findAll(query, user);
  }

  // public tracking by token — must be declared before :referenceId so the static segment wins
  @Get('track/:token')
  @Public()
  @ApiTrackOrder()
  async track(@Param('token') token: string) {
    return this.ordersService.findByTrackingToken(token);
  }

  // order detail
  @Get(':referenceId')
  @ApiGetOrder()
  async findOne(
    @Param('referenceId') referenceId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.findOne(referenceId, user);
  }

  // update order
  @Patch(':referenceId')
  @AdminOrDispatcher()
  @ApiUpdateOrder()
  async update(
    @Param('referenceId') referenceId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.update(referenceId, dto);
  }

  // update order status
  @Patch(':referenceId/status')
  @ApiUpdateOrderStatus()
  async updateStatus(
    @Param('referenceId') referenceId: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.updateStatus(referenceId, dto, user);
  }

  // assign driver
  @Patch(':referenceId/assign')
  @AdminOrDispatcher()
  @ApiAssignDriver()
  async assignDriver(
    @Param('referenceId') referenceId: string,
    @Body() dto: AssignDriverDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.assignDriver(referenceId, dto, user);
  }

  // upload proof of delivery
  @Post(':referenceId/pod')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiUploadPod()
  async uploadPod(
    @Param('referenceId') referenceId: string,
    @UploadedFile() file: UploadedPodFile,
    @Body() dto: UploadPodDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.uploadPod(referenceId, file, dto, user);
  }

  // delete order
  @Delete(':referenceId')
  @AdminOnly()
  @ApiDeleteOrder()
  async remove(@Param('referenceId') referenceId: string) {
    return this.ordersService.remove(referenceId);
  }
}
