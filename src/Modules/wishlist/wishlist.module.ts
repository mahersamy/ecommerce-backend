import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Wishlist, WishlistSchema } from 'src/DB/Models/wishlist.model';
import { Product, ProductSchema } from 'src/DB/Models/product.model';
import { WishlistRepository } from 'src/DB/Repository/wishlist.repository';
import { ProductRepository } from 'src/DB/Repository/product.repository';

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
