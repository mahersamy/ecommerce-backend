import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthApply } from '../../common/Decorators/authApply.decorator';
import { AuthUser, ParamIdDto, Role } from '../../common';
import type { UserDocument } from '../../DB/Models/users.model';
import { FileUpload, UploadedFileValidated } from '../../common/Decorators';
import { GetAllDto } from '../../common/Dto/get-all.dto';

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
  findAllBrands(@Query() query: GetAllDto) {
    return this.brandsService.findAllBrands();
  }

  @Get(':id')
  findOneBrand(@Param('id') { id }: ParamIdDto) {
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
  removeBrand(@Param('id') { id }: ParamIdDto) {
    return this.brandsService.removeBrand(id);
  }
}
