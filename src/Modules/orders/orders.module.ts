import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../DB/Models/orders.model';
import { OrderRepository } from '../../DB/Repository/order.repository';
import { CartRepository } from '../../DB/Repository/cart.repository';
import { Cart, CartSchema } from '../../DB/Models/cart.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, CartRepository],
})
export class OrdersModule {}
