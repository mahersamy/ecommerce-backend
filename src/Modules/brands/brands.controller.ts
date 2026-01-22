import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthApply } from 'src/common/Decorators/authApply.decorator';
import { AuthUser, Role } from 'src/common';
import type { UserDocument } from 'src/DB/Models/users.model';
import { FileUpload, UploadedFileValidated } from 'src/common/Decorators';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @AuthApply({ roles: [Role.ADMIN] })
  @FileUpload()
  @Post()
  createBrand(
    @Body() createBrandDto: CreateBrandDto,
    @AuthUser() user: UserDocument,
    @UploadedFileValidated() brandLogo: Express.Multer.File,
  ) {
    return this.brandsService.createBrand(createBrandDto, user, brandLogo);
  }

  @Get()
  findAllBrands() {
    return this.brandsService.findAllBrands();
  }

  @Get(':id')
  findOneBrand(@Param('id') id: string) {
    return this.brandsService.findOneBrand(id);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @FileUpload()
  @Patch(':id')
  updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFileValidated() brandLogo: Express.Multer.File,
  ) {
    return this.brandsService.updateBrand(id, updateBrandDto, brandLogo);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @Delete(':id')
  removeBrand(@Param('id') id: string) {
    return this.brandsService.removeBrand(id);
  }
}
