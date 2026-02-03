import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandRepository } from '../../DB/Repository/brand.repository';
import { Brand, BrandSchema } from '../../DB/Models/brands.model';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from '../../common/services/cloudinary/cloudinary.service';
import { Category, CategorySchema } from '../../DB/Models/category.model';
import { CategoryRepository } from '../../DB/Repository/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    BrandRepository,
    CategoryRepository,
    CloudinaryService,
  ],
})
export class BrandsModule {}
