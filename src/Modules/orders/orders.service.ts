import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from 'src/DB/Repository/order.repository';
import { CartRepository } from 'src/DB/Repository/cart.repository';
import { UserDocument } from 'src/DB/Models/users.model';
import { OrderStatus } from 'src/common';

@Injectable()
export class OrdersService {
  constructor(
    private readonly OrderRepository: OrderRepository,
    private readonly CartRepository: CartRepository,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: UserDocument) {
    const cart = await this.CartRepository.findOne({ userId: user._id });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    const order = await this.OrderRepository.create({
      ...createOrderDto,
      user: user._id,
      totalAmount: cart.totalPrice,
      orderStatus: OrderStatus.PENDING,
      orderItems: cart.items,
    });
    await order.populate('orderItems.product');
    return order;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
