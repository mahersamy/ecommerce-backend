import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponRepository } from 'src/DB/Repository/coupon.repository';
import { Types } from 'mongoose';
import { UserDocument } from 'src/DB/Models/users.model';

@Injectable()
export class CouponService {

  constructor(private readonly couponRepository: CouponRepository) {}
  create(createCouponDto: CreateCouponDto,user: UserDocument) {
    // const coupon = this.couponRepository.create({
    //   ...createCouponDto,
    //   createdBy:user._id,
    // });
    return "coupon";
  }

  findAll() {
    return `This action returns all coupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
