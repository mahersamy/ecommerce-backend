import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/common';

export class ChangeStatusDto {
  @IsEnum([OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.PENDING,])
  @IsNotEmpty()
  status: OrderStatus;
}
