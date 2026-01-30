import { Expose } from "class-transformer";

export class ProductResponseDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    finalPrice: number;

    @Expose()
    description: string;

    @Expose()
    images: string[];

    @Expose()
    brand: string;

    @Expose()
    category: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}