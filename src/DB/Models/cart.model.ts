import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './users.model';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true, virtuals: true, toJSON: { virtuals: true } })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  // price snapshot (important!)
  @Prop({ type: Number, required: true })
  price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({
  timestamps: true,
  virtuals: true,
  toJSON: { virtuals: true },
})
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ type: Number, default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre('save', function (this: CartDocument) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
});

