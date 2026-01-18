import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type BrandDocument = HydratedDocument<Brand>;


@Schema({ timestamps: true ,virtuals: true ,toJSON: { virtuals: true }})
export class Brand {
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ required: true, type: String })
  createdBy: string;


}

export const BrandSchema = SchemaFactory.createForClass(Brand);

