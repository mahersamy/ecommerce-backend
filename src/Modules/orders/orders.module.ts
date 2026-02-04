import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../DB/Models/orders.model';
import { OrderRepository } from '../../DB/Repository/order.repository';
import { CartRepository } from '../../DB/Repository/cart.repository';
import { Cart, CartSchema } from '../../DB/Models/cart.model';
import { CouponRepository } from '../../DB/Repository/coupon.repository';
import { Coupon, CouponSchema } from '../../DB/Models/coupon.model';
import { CartService } from '../cart/cart.service';
import { ProductRepository } from '../../DB/Repository/product.repository';
import { Product, ProductSchema } from '../../DB/Models/product.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ProductRepository,
    OrderRepository,
    CartRepository,
    CouponRepository,
    CartService,
    ProductRepository
  ],
})
export class OrdersModule {}
