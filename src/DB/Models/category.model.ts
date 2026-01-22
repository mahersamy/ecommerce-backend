import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, virtuals: true, toJSON: { virtuals: true } })
export class Category {
  @Prop({
    required: true,
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  name: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: String })
  logoPublicId: string;

  @Prop({ type: String, index: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Hooks
CategorySchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
});

CategorySchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as UpdateQuery<CategoryDocument>;
  if (update.name) {
    update.slug = update.name.toLowerCase().replace(/\s+/g, '-');
  }
});
