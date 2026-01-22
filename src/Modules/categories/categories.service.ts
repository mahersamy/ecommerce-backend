import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { UserDocument } from 'src/DB/Models/users.model';
import { CategoryRepository } from 'src/DB/Repository/category.repository';
import {
  CloudinaryResponse,
  CloudinaryService,
} from 'src/common/services/cloudinary/cloudinary.service';
import { BrandRepository } from 'src/DB/Repository/brand.repository';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly brandRepository: BrandRepository,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    user: UserDocument,
    categoryLogo: Express.Multer.File,
  ) {
    const category = await this.categoryRepository.findOne({
      name: createCategoryDto.name,
    });
    if (category) {
      throw new BadRequestException('Category already exists');
    }
    let categoryLogoUrl: CloudinaryResponse | undefined = undefined;
    if (categoryLogo) {
      categoryLogoUrl = await this.cloudinaryService.uploadFile(categoryLogo, {
        folder: 'categories',
        quality: 50,
        toWebp: true,
      });
    }
    const newCategory = await this.categoryRepository.create({
      ...createCategoryDto,
      logo: categoryLogoUrl?.secure_url,
      logoPublicId: categoryLogoUrl?.public_id,
      createdBy: user._id,
    });

    return newCategory;
  }

  async findAll() {
    return this.categoryRepository.findAllWithBrands();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    categoryLogo: Express.Multer.File,
  ) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    // Check duplicate name
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        name: updateCategoryDto.name,
      });

      if (existingCategory && existingCategory._id.toString() !== id) {
        throw new BadRequestException('Category name already exists');
      }
    }
    if (categoryLogo) {
      if (category.logoPublicId) {
        await this.cloudinaryService.deleteFile(category.logoPublicId);
      }
      const categoryLogoUrl = await this.cloudinaryService.uploadFile(
        categoryLogo,
        {
          folder: 'categories',
          quality: 50,
          toWebp: true,
        },
      );
      category.logo = categoryLogoUrl.secure_url;
      category.logoPublicId = categoryLogoUrl.public_id;
    }
    const updatedCategory = await this.categoryRepository.update(id, {
      ...updateCategoryDto,
      logo: category.logo,
      logoPublicId: category.logoPublicId,
    });
    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (category.logoPublicId) {
      await this.cloudinaryService.deleteFile(category.logoPublicId);
    }
    await this.categoryRepository.delete(id);
    return `removed category ${category.name} successfully`;
  }

  async findBrands(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const brands = await this.brandRepository.findByCategoryId(id);
    return brands;
  }
}
