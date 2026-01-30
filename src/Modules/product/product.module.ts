import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/DB/Models/product.model';
import { Brand, BrandSchema } from 'src/DB/Models/brands.model';
import { Category, CategorySchema } from 'src/DB/Models/category.model';
import { ProductRepository } from 'src/DB/Repository/product.repository';
import { BrandRepository } from 'src/DB/Repository/brand.repository';
import { CategoryRepository } from 'src/DB/Repository/category.repository';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

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
