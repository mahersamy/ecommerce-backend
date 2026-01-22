import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthApply } from 'src/common/Decorators/authApply.decorator';
import { AuthUser, Role } from 'src/common';
import type { UserDocument } from 'src/DB/Models/users.model';
import { FileUpload, UploadedFileValidated } from 'src/common/Decorators';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @AuthApply({ roles: [Role.ADMIN] })
  @FileUpload()
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @AuthUser() user: UserDocument,
    @UploadedFileValidated() categoryLogo: Express.Multer.File,
  ) {
    return this.categoriesService.create(createCategoryDto, user, categoryLogo);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/brands')
  findBrands(@Param('id') id: string) {
    return this.categoriesService.findBrands(id);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @FileUpload()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFileValidated() categoryLogo: Express.Multer.File,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, categoryLogo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
