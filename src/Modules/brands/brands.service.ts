import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from 'src/DB/Repository/brand.repository';
import { User, UserDocument } from 'src/DB/Models/users.model';
import { CloudinaryResponse, CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';

@Injectable()
export class BrandsService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createBrand(
    createBrandDto: CreateBrandDto,
    user: Partial<UserDocument>,
    brandLogo: Express.Multer.File,
  ) {
    const brand = await this.brandRepository.findOne({
      name: createBrandDto.name,
    });
    if (brand) {
      throw new BadRequestException('Brand already exists');
    }
    let brandLogoUrl:CloudinaryResponse | undefined = undefined;
    if (brandLogo) {
      brandLogoUrl = await this.cloudinaryService.uploadFile(brandLogo, {
        folder: 'brands',
        quality: 50,
        toWebp: true,
      });
    }
    const newBrand = await this.brandRepository.create({
      ...createBrandDto,
      logo: brandLogoUrl!.secure_url,
      logoPublicId: brandLogoUrl!.public_id,
      createdBy: user._id,
    });

    return newBrand;
  }

  async findAllBrands() {
    return await this.brandRepository.find();
  }

  async findOneBrand(id: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new BadRequestException('Brand not found');
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
      if (brand.logoPublicId) {
        await this.cloudinaryService.deleteFile(brand.logoPublicId);
      }
      const brandLogoUrl = await this.cloudinaryService.uploadFile(brandLogo, {
        folder: 'brands',
        quality: 50,
        toWebp: true,
      });
      brand.logo = brandLogoUrl.secure_url;
      brand.logoPublicId = brandLogoUrl.public_id;
    }

    const updatedBrand = await this.brandRepository.update(id, {
      ...updateBrandDto,
      logo: brand.logo,
      logoPublicId: brand.logoPublicId,
    });

    return updatedBrand;
  }

  removeBrand(id: string) {
    return `This action removes a #${id} brand`;
  }
}
