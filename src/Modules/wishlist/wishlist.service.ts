import { Injectable, NotFoundException } from '@nestjs/common';
import { WishlistRepository } from '../../DB/Repository/wishlist.repository';
import { ProductRepository } from '../../DB/Repository/product.repository';
import { UserDocument } from '../../DB/Models/users.model';
import { AddToWishlistDto } from './dto/add-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async addToWishlist(addToWishlistDto: AddToWishlistDto, user: UserDocument) {
    const { productId } = addToWishlistDto;

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let wishlist = await this.wishlistRepository.findOne({ userId: user._id });

    if (!wishlist) {
      wishlist = await this.wishlistRepository.create({
        userId: user._id,
        products: [product._id],
      });
    } else {
      await this.wishlistRepository.findOneAndUpdate(
        { userId: user._id },
        { $addToSet: { products: productId } },
      );
    }

    return this.getWishlist(user);
  }

  async removeFromWishlist(
    removeFromWishlistDto: RemoveFromWishlistDto,
    user: UserDocument,
  ) {
    const { productId } = removeFromWishlistDto;

    const wishlist = await this.wishlistRepository.findOneAndUpdate(
      { userId: user._id },
      { $pull: { products: productId } },
    );

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return this.getWishlist(user);
  }

  async getWishlist(user: UserDocument) {
    const wishlist = await this.wishlistRepository.findOne(
      { userId: user._id },
      {},
      { populate: 'products' },
    );

    if (!wishlist) {
      return { products: [] }; // Return empty if no wishlist yet
    }

    return wishlist;
  }
}
