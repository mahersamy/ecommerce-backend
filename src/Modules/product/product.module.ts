import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../DB/Models/product.model';
import { Brand, BrandSchema } from '../../DB/Models/brands.model';
import { Category, CategorySchema } from '../../DB/Models/category.model';
import { ProductRepository } from '../../DB/Repository/product.repository';
import { BrandRepository } from '../../DB/Repository/brand.repository';
import { CategoryRepository } from '../../DB/Repository/category.repository';
import { CloudinaryService } from '../../common/services/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    BrandRepository,
    CategoryRepository,
    CloudinaryService,
  ],
})
export class ProductModule {}
