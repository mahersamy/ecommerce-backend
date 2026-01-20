import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from '../Models/brands.model';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';

export class BrandRepository extends BaseRepository<BrandDocument> {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {
    super(brandModel);
  }
}
