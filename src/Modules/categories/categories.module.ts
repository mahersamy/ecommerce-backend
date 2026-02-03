import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryRepository } from '../../DB/Repository/category.repository';
import { CloudinaryService } from '../../common/services/cloudinary/cloudinary.service';
import { Category, CategorySchema } from '../../DB/Models/category.model';
import { BrandRepository } from '../../DB/Repository/brand.repository';
import { Brand, BrandSchema } from '../../DB/Models/brands.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoryRepository,
    CloudinaryService,
    BrandRepository,
  ],
})
export class CategoriesModule {}
