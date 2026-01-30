import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import { Category } from './category.model';
import { Brand } from './brands.model';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, virtuals: true, toJSON: { virtuals: true } })
export class Product {
  @Prop({
    required: true,
    type: String,
    unique: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({ type: String, trim: true })
  overview: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ required: true, type: Number, min: 0 })
  finalPrice: number;

  @Prop({ type: Number, default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, type: Number, min: 0 })
  stock: number;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({
    type: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    default: [],
  })
  images: { secure_url: string; public_id: string; _id: Types.ObjectId }[];

  // IDs
  @Prop({ required: true, type: Types.ObjectId, ref: Category.name })
  category: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Brand.name })
  brand: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Hooks
ProductSchema.pre('save', function () {
  if (this.title) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
  }

  if (this.isModified('price') || this.isModified('discount')) {
    this.finalPrice = this.price - (this.price * this.discount) / 100;
  }
});

ProductSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() as UpdateQuery<ProductDocument>;
  if (update.title) {
    update.slug = update.title.toLowerCase().replace(/\s+/g, '-');
  }

  if (update.price || update.discount) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc) {
      const price = update.price ?? doc.price;
      const discount = update.discount ?? doc.discount;
      update.finalPrice = price - (price * discount) / 100;
    }
  }
});
