import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './users.model';
import { Product } from './product.model';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ timestamps: true, virtuals: true, toJSON: { virtuals: true } })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }], default: [] })
  products: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
