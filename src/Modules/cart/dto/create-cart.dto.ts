import { IsMongoId, IsNumber, Min } from "class-validator";
import { Types } from "mongoose";

export class CreateCartDto {

    @IsMongoId()
    productId: Types.ObjectId;

    @IsNumber()
    @Min(1)
    quantity: number;
}
