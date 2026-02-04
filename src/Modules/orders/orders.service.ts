import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from '../../DB/Repository/order.repository';
import { UserDocument } from '../../DB/Models/users.model';
import { DiscountType, OrderStatus } from '../../common';
import { CouponRepository } from '../../DB/Repository/coupon.repository';
import { AuthApply } from '../../common/Decorators/authApply.decorator';
import { CartService } from '../cart/cart.service';
import { ProductRepository } from '../../DB/Repository/product.repository';
import { Types } from 'mongoose';

@AuthApply({ roles: [] })
@Injectable()
export class OrdersService {
  constructor(
    private readonly OrderRepository: OrderRepository,
    private readonly CartService: CartService,
    private readonly CouponRepository: CouponRepository,
    private readonly ProductRepository: ProductRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: UserDocument) {
    const cart = await this.CartService.getLoggedCart(user);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let totalAmount = cart.totalPrice;

    // Coupon is optional
    if (createOrderDto.coupon) {
      const coupon = await this.CouponRepository.findOne({
        _id: createOrderDto.coupon,
        isActive: true,
        endDate: { $gte: new Date() },
        startDate: { $lte: new Date() },
        usedBy: { $ne: user._id },
      });

      if (!coupon) {
        throw new BadRequestException('Coupon is not valid');
      }

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }

      // Apply coupon discount
      if (coupon.discountType === DiscountType.FIXED) {
        if (totalAmount < coupon.discountValue) {
          throw new BadRequestException(
            'Cart total must be greater than coupon discount value',
          );
        }
        totalAmount -= coupon.discountValue;
      } else {
        // Percentage discount
        totalAmount -= (cart.totalPrice * coupon.discountValue) / 100;
      }

      // Update coupon usage
      await coupon.updateOne({
        $push: { usedBy: user._id },
        $inc: { usedCount: 1 },
      });
    }

    // Validate and update stock for all items
    for (const item of cart.items) {
      const product = await this.ProductRepository.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
      );

      if (!product) {
        throw new BadRequestException(
          `Insufficient stock for one or more products in your cart`,
        );
      }
    }

    const order = await this.OrderRepository.create({
      ...createOrderDto,
      user: user._id,
      totalAmount: totalAmount,
      orderStatus: OrderStatus.PENDING,
      orderItems: cart.items,
    });

    await this.CartService.clearCart(user);
    await order.populate('orderItems.product');
    return order;
  }

  async findAll(user: UserDocument) {
    return this.OrderRepository.find(
      { user: user._id },
      {},
      {
        populate: 'orderItems.product',
        sort: { createdAt: -1 },
      },
    );
  }

  async findOne(id: string, user: UserDocument) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.OrderRepository.findOne(
      {
        _id: id,
        user: user._id,
      },
      {},
      {
        populate: 'orderItems.product coupon',
      },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto,) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.OrderRepository.findOne({
      _id: id,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow updating certain fields
    const allowedUpdates: Partial<UpdateOrderDto> = {};
    if (updateOrderDto.address) allowedUpdates.address = updateOrderDto.address;
    if (updateOrderDto.phone) allowedUpdates.phone = updateOrderDto.phone;
    if (updateOrderDto.note !== undefined)
      allowedUpdates.note = updateOrderDto.note;

    const updatedOrder = await this.OrderRepository.findByIdAndUpdate(
      id,
      allowedUpdates,
      {
        populate: 'orderItems.product',
      },
    );

    return updatedOrder;
  }

  async updateStatus(id: string, status: OrderStatus, user: UserDocument) {
    const order = await this.OrderRepository.findOne({
      _id: id,
      user: user._id,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transitions
    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled order');
    }

    if (order.orderStatus === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot update a delivered order');
    }

    const updatedOrder = await this.OrderRepository.findByIdAndUpdate(
      id,
      { orderStatus: status },
      {
        populate: 'orderItems.product',
      },
    );

    return updatedOrder;
  }

  async cancelOrder(id: string, user: UserDocument) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.OrderRepository.findOne({
      _id: id,
      user: user._id,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow cancellation if order is pending
    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Restore product stock
    for (const item of order.orderItems) {
      await this.ProductRepository.findOneAndUpdate(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      );
    }

    // Restore coupon usage if coupon was used
    if (order.coupon) {
      await this.CouponRepository.findOneAndUpdate(
        { _id: order.coupon },
        {
          $pull: { usedBy: user._id },
          $inc: { usedCount: -1 },
        },
      );
    }

    const updatedOrder = await this.OrderRepository.findByIdAndUpdate(
      id,
      { orderStatus: OrderStatus.CANCELLED },
      {
        populate: 'orderItems.product',
      },
    );

    return updatedOrder;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.OrderRepository.findOne({
      _id: id,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only allow deletion of cancelled orders
    if (order.orderStatus !== OrderStatus.CANCELLED) {
      throw new BadRequestException('Only cancelled orders can be deleted');
    }

    await this.OrderRepository.findByIdAndDelete(id);
    return { message: 'Order deleted successfully' };
  }
}
