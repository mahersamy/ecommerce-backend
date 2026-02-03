import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { Types } from "mongoose";
import { OrderStatus, PaymentType } from "src/common";

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsOptional()
    note:string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
    phone:string;

    

    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsOptional()
    coupon:Types.ObjectId;


    @IsEnum(PaymentType)
    @IsNotEmpty()
    paymentMethod:PaymentType;



    // @IsEnum(OrderStatus)
    // @IsNotEmpty()
    // orderStatus:OrderStatus;
}
