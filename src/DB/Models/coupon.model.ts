import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DiscountType } from '../../common';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ type: String, enum: DiscountType, required: true })
  discountType: DiscountType;

  // percent (0–100) OR fixed amount
  @Prop({ required: true, min: 0 })
  discountValue: number;

  // 👇 Duration (Validity)
  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  // Max number of times coupon can be used
  @Prop({ default: 0 })
  usageLimit: number; // 0 = unlimited

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  usedBy: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Virtual()
  get isExpired() {
    return new Date() > this.endDate;
  }

  @Virtual()
  get isValidNow() {
    return !this.isExpired && this.isActive;
  }
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
