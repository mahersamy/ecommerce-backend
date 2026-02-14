import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthApply } from '../../common/Decorators/authApply.decorator';
import { AuthUser, OrderStatus, ParamIdDto, Role } from '../../common';
import type { UserDocument } from '../../DB/Models/users.model';
import { ChangeStatusDto } from './dto/change-status.dto';

@AuthApply({ roles: [] })
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @AuthUser() user: UserDocument,
  ) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll(@AuthUser() user: UserDocument) {
    return this.ordersService.findAll(user);
  }

  @Patch(':id')
  @AuthApply({ roles: [Role.ADMIN] })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @AuthApply({ roles: [Role.ADMIN] })
  updateStatus(
    @Param() param: ParamIdDto,
    @Body() status: ChangeStatusDto,
    @AuthUser() user: UserDocument,
  ) {
    return this.ordersService.updateStatus(param.id, status.status, user);
  }

  @Post(':id/checkout')
  checkout(@Param() param: ParamIdDto, @AuthUser() user: UserDocument) {
    return this.ordersService.checkout(param.id, user);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @Patch(':id/cancel')
  cancelOrder(@Param() param: ParamIdDto, @AuthUser() user: UserDocument) {
    return this.ordersService.cancelOrder(param.id, user);
  }

  @Delete(':id')
  @AuthApply({ roles: [Role.ADMIN] })
  remove(@Param('id') param: ParamIdDto) {
    return this.ordersService.remove(param.id);
  }
}
