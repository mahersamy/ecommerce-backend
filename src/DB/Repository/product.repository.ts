import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../Models/product.model';

export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }
  async findByIdWithPopulate(id: string) {
    return this.productModel.findById(id).populate(['category', 'brand']);
  }
}
