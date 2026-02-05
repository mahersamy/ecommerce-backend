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
import { NotificationService } from '../notification/notification.service';
import { NotificationRepository } from '../../DB/Repository/notification.repository';
import { Notification, NotificationSchema } from '../../DB/Models/notification.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Notification.name, schema: NotificationSchema },
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
    ProductRepository,
    NotificationService,
    NotificationRepository,
  ],
})
export class OrdersModule {}
