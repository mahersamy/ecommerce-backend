import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../../common';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
