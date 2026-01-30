
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}
