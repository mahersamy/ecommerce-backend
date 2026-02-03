import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist, WishlistSchema } from '../../DB/Models/wishlist.model';
import { Product, ProductSchema } from '../../DB/Models/product.model';
import { WishlistRepository } from '../../DB/Repository/wishlist.repository';
import { ProductRepository } from '../../DB/Repository/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wishlist.name, schema: WishlistSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService, WishlistRepository, ProductRepository],
})
export class WishlistModule {}
