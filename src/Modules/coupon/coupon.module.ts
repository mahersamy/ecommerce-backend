import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepository } from '../../DB/Repository/coupon.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from '../../DB/Models/coupon.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
})
export class CouponModule {}
