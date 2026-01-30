import { IsMongoId, IsNotEmpty } from 'class-validator';

export class RemoveFromWishlistDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;
}
