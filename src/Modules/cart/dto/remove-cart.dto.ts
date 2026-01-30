import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class RemoveCartDto {
    @IsMongoId()
    productId: Types.ObjectId;
}