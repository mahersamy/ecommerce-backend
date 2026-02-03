import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from '../../DB/Repository/brand.repository';
import { CategoryRepository } from '../../DB/Repository/category.repository';
import type { UserDocument } from '../../DB/Models/users.model';
import {
  CloudinaryResponse,
  CloudinaryService,
} from '../../common/services/cloudinary/cloudinary.service';
import { Types } from 'mongoose';
import { CategoryDocument } from '../../DB/Models/category.model';

@Injectable()
export class BrandsService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createBrand(
    createBrandDto: CreateBrandDto,
    user: UserDocument,
    brandLogo: Express.Multer.File,
  ) {
    const brand = await this.brandRepository.findOne({
      name: createBrandDto.name,
    });
    if (brand) {
      throw new BadRequestException('Brand already exists');
    }

    // Validate all category IDs if provided
    if (createBrandDto.categoryIds && createBrandDto.categoryIds.length > 0) {
      for (const categoryId of createBrandDto.categoryIds) {
        const category = await this.categoryRepository.findById(
          categoryId.toString(),
        );
        if (!category) {
          throw new BadRequestException(`Invalid category ID: ${categoryId}`);
        }
      }
    }

    let brandLogoUrl: CloudinaryResponse | undefined = undefined;
    if (brandLogo) {
      brandLogoUrl = await this.cloudinaryService.uploadFile(brandLogo, {
        folder: 'brands',
        quality: 50,
        toWebp: true,
      });
    }

    const newBrand = await this.brandRepository.create({
      ...createBrandDto,
      logo: brandLogoUrl?.secure_url,
      logoPublicId: brandLogoUrl?.public_id,
      createdBy: user._id as Types.ObjectId,
    });

    return newBrand;
  }

  async findAllBrands() {
    return await this.brandRepository.find();
  }

  async findOneBrand(id: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async updateBrand(
    id: string,
    updateBrandDto: UpdateBrandDto,
    brandLogo: Express.Multer.File,
  ) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }

    // Check duplicate name
    if (updateBrandDto.name) {
      const existingBrand = await this.brandRepository.findOne({
        name: updateBrandDto.name,
      });

      // if found and not the same brand
      if (existingBrand && existingBrand._id.toString() !== id) {
        throw new BadRequestException('Brand name already exists');
      }
    }

    if (brandLogo) {
      const deletePromise = brand.logoPublicId
        ? this.cloudinaryService.deleteFile(brand.logoPublicId)
        : Promise.resolve();
      const uploadPromise = this.cloudinaryService.uploadFile(brandLogo, {
        folder: 'brands',
        quality: 50,
        toWebp: true,
      });

      const [_, brandLogoUrl] = await Promise.all([
        deletePromise,
        uploadPromise,
      ]);

      brand.logo = brandLogoUrl.secure_url;
      brand.logoPublicId = brandLogoUrl.public_id;
    }

    // Validate all category IDs if provided

    const categoryIds: Types.ObjectId[] = [...brand.categoryIds];
    if (updateBrandDto.categoryIds && updateBrandDto.categoryIds.length > 0) {
      for (const categoryId of updateBrandDto.categoryIds) {
        const category = await this.categoryRepository.findById(categoryId);
        if (category) {
          categoryIds.push(category._id);
        }
        if (!category) {
          throw new BadRequestException(`Invalid category ID: ${categoryId}`);
        }
      }
    }

    const updatedBrand = await this.brandRepository.findByIdAndUpdate(id, {
      ...updateBrandDto,
      logo: brand.logo,
      logoPublicId: brand.logoPublicId,
      categoryIds: categoryIds,
    });

    return updatedBrand;
  }

  async removeBrand(id: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new BadRequestException('Brand not found');
    }
    if (brand.logoPublicId) {
      await this.cloudinaryService.deleteFile(brand.logoPublicId);
    }
    await this.brandRepository.findByIdAndDelete(id);
    return `removed brand ${brand.name} successfully`;
  }
}
