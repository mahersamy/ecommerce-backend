import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponRepository } from '../../DB/Repository/coupon.repository';
import { Types } from 'mongoose';
import { UserDocument } from '../../DB/Models/users.model';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async create(createCouponDto: CreateCouponDto, user: UserDocument) {
    // Check if coupon code already exists
    const existingCoupon = await this.couponRepository.findOne({
      code: createCouponDto.code.toUpperCase(),
    });

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = await this.couponRepository.create({
      ...createCouponDto,
      code: createCouponDto.code.toUpperCase(),
      createdBy: user._id,
      usedCount: 0,
      usedBy: [],
    });

    return coupon;
  }

  async findAll() {
    return this.couponRepository.find({});
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }

    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.couponRepository.findOne({
      code: code.toUpperCase(),
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }

    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    // If updating code, check if the new code already exists
    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({
        code: updateCouponDto.code.toUpperCase(),
      });
      if (existingCoupon) {
        throw new BadRequestException('Coupon code already exists');
      }
    }

    const updatedCoupon = await this.couponRepository.findByIdAndUpdate(id, {
      ...updateCouponDto,
      ...(updateCouponDto.code && {
        code: updateCouponDto.code.toUpperCase(),
      }),
    });

    return updatedCoupon;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }

    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await this.couponRepository.findByIdAndDelete(id);
    return { message: 'Coupon deleted successfully' };
  }

  async deactivate(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }

    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await this.couponRepository.findByIdAndUpdate(id, { isActive: false });
    return { message: 'Coupon deactivated successfully' };
  }

  async activate(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }

    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await this.couponRepository.findByIdAndUpdate(id, { isActive: true });
    return { message: 'Coupon activated successfully' };
  }

  async getActiveCoupons() {
    const now = new Date();
    return this.couponRepository.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
  }

  async validateCoupon(code: string, userId: Types.ObjectId) {
    const coupon = await this.couponRepository.findOne({
      code: code.toUpperCase(),
      isActive: true,
      endDate: { $gte: new Date() },
      startDate: { $lte: new Date() },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid or expired coupon');
    }

    // Check if user has already used this coupon
    if (coupon.usedBy.some((id) => id.toString() === userId.toString())) {
      throw new BadRequestException('You have already used this coupon');
    }

    // Check if usage limit is reached
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    return {
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    };
  }
}
