import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument, Types, UpdateQuery } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true, virtuals: true, toJSON: { virtuals: true } })
export class Brand {
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

export const BrandSchema = SchemaFactory.createForClass(Brand);

// Hooks
BrandSchema.pre('save', function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
});

BrandSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as UpdateQuery<BrandDocument>;
  if (update.name) {
    update.slug = update.name.toLowerCase().replace(/\s+/g, '-');
  }
});
