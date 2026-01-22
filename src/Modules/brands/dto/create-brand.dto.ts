import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateBrandDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  @MaxLength(50)
  name: string;


  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  categoryIds?: Types.ObjectId[];
}
