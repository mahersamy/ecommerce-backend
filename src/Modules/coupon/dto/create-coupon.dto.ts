import { DiscountType, IsAfterConstraint } from '../../../common';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  discountType: DiscountType;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Max(100)
  discountValue: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Validate(IsAfterConstraint, ['startDate'])
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  usageLimit: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
