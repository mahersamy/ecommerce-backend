import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from 'src/common/Enums/order-status';
import { PaymentType } from 'src/common/Enums/payment-type.enum';
import { CartItem, CartItemSchema } from './cart.model';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Order {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ type: String })
  note: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Coupon' })
  coupon: Types.ObjectId;

  @Prop({ required: true, type: Number })
  totalAmount: number;

  //   @Prop({ required: true, type: Number })
  //   discountAmount: number;

  //   @Prop({ required: true, type: Number })
  //   finalAmount: number;

  @Prop({ required: true, type: String, enum: PaymentType })
  paymentMethod: PaymentType;

  @Prop({ required: true, type: String, enum: OrderStatus })
  orderStatus: OrderStatus;

  @Prop({ required: true, type: [CartItemSchema] })
  orderItems: CartItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
