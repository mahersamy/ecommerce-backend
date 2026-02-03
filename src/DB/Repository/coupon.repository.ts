import { BaseRepository } from './base.repository';
import { Coupon, CouponDocument } from '../Models/coupon.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CouponRepository extends BaseRepository<CouponDocument> {
  constructor(@InjectModel(Coupon.name) model: Model<CouponDocument>) {
    super(model);
  }
}