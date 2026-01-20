import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandRepository } from 'src/DB/Repository/brand.repository';
import { Brand, BrandSchema } from 'src/DB/Models/brands.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../Auth/auth.module';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [BrandsController],
  providers: [BrandsService, BrandRepository, CloudinaryService],
})
export class BrandsModule {}
