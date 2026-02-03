import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from '../../DB/Repository/cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '../../DB/Models/cart.model';
import { Product, ProductSchema } from '../../DB/Models/product.model';
import { ProductRepository } from '../../DB/Repository/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],

  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository],
})
export class CartModule {}
