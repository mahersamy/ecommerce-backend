import { Types } from "mongoose";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class DeleteProductImageDto {
    @IsMongoId()
    @IsNotEmpty()
    imageId: Types.ObjectId;
}