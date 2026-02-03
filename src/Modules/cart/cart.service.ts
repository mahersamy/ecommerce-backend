import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartRepository } from '../../DB/Repository/cart.repository';
import type { UserDocument } from '../../DB/Models/users.model';
import { ProductRepository } from '../../DB/Repository/product.repository';
import { Types } from 'mongoose';
import { RemoveCartDto } from './dto/remove-cart.dto';
import { ParamIdDto } from '../../common';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createCartDto: CreateCartDto, user: UserDocument) {
    // Find and validate product
    const product = await this.productRepository.findOne({
      _id: createCartDto.productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check stock availability
    if (product.stock < createCartDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    let cart = await this.cartRepository.findOne({
      userId: user._id,
    });

    if (cart) {
      // Cart exists - check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === createCartDto.productId.toString(),
      );

      if (existingItemIndex !== -1) {
        // Product exists in cart - update quantity
        const newQuantity =
          cart.items[existingItemIndex].quantity + createCartDto.quantity;

        // Check if new quantity exceeds stock
        if (newQuantity > product.stock) {
          throw new BadRequestException(
            `Cannot add ${createCartDto.quantity} items. Maximum available: ${
              product.stock - cart.items[existingItemIndex].quantity
            }`,
          );
        }

        cart.items[existingItemIndex].quantity = newQuantity;
        await cart.save();
        return cart.populate('items.product');
      } else {
        cart.items.push({
          product: createCartDto.productId,
          quantity: createCartDto.quantity,
          price: product.price,
        });
        await cart.save();
        return cart.populate('items.product');
      }
    } else {
      cart = await this.cartRepository.create({
        userId: user._id,
        items: [
          {
            product: createCartDto.productId,
            quantity: createCartDto.quantity,
            price: product.price,
          },
        ],
      });
    }
    return await cart.populate('items.product');
  }

  async getLoggedCart(user: UserDocument) {
    return await this.cartRepository.findOne(
      {
        userId: user._id,
      },
      {},
      { populate: 'items.product' },
    );
  }

  async editCartItem(updateCartDto: UpdateCartDto, user: UserDocument) {
    const cart = await this.cartRepository.findOne({ userId: user._id });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.productRepository.findOne({
      _id: updateCartDto.productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < updateCartDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === updateCartDto.productId.toString(),
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    if (updateCartDto.quantity <= 0) {
      return this.remove(
        { productId: updateCartDto.productId as unknown as Types.ObjectId },
        user,
      );
    } else {
      cart.items[itemIndex].quantity = updateCartDto.quantity;
    }

    cart.items[itemIndex].price = product.price;

    await cart.save();
    return cart.populate('items.product');
  }

  async remove(removeCartDto: RemoveCartDto, user: UserDocument) {
    const cart = await this.cartRepository.findOne({ userId: user._id });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === removeCartDto.productId.toString(),
    );

    if (!itemExists) {
      throw new NotFoundException('Product not found in cart');
    }

    const updatedCart = await this.cartRepository.findOneAndUpdate(
      { userId: user._id },
      { $pull: { items: { product: removeCartDto.productId } } },
    );

    if (updatedCart) {
      updatedCart.totalPrice = updatedCart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      await updatedCart.save();
    }

    if (!updatedCart) {
      throw new NotFoundException('Cart not found');
    }
    return updatedCart.populate('items.product');
  }

  async clearCart(user: UserDocument) {
    const cart = await this.cartRepository.findOne({
      userId: user._id,
    });

    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }

    // if (cart.items.length === 0) {
    //   throw new BadRequestException('Cart is already empty');
    // }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return {
      message: 'Cart cleared successfully',
      cart: cart,
    };
  }
}
