import { BaseRepository } from './base.repository';
import { Cart, CartDocument } from '../Models/cart.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

export class CartRepository extends BaseRepository<CartDocument> {
  constructor(@InjectModel(Cart.name) model: Model<CartDocument>) {
    super(model);
  }

  async findOneWithPopulate(filter: QueryFilter<CartDocument>): Promise<CartDocument|null> {
    return await this.model.findOne(filter).populate('items.productId');
  }
}
