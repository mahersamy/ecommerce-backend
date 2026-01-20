import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthApply } from 'src/common/Decorators/authApply.decorator';
import { AuthUser, Role } from 'src/common';
import type { UserDocument } from 'src/DB/Models/users.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @AuthApply({ roles: [Role.ADMIN] })
  @UseInterceptors(FileInterceptor('logo'))
  @Post()
  createBrand(
    @Body() createBrandDto: CreateBrandDto,
    @AuthUser() user: UserDocument,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: 'image/(jpeg|png|jpg)',
            skipMagicNumbersValidation: true,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    brandLogo: Express.Multer.File,
  ) {
    return this.brandsService.createBrand(createBrandDto, user, brandLogo);
  }

  @Get()
  findAllBrands() {
    return this.brandsService.findAllBrands();
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @Get(':id')
  findOneBrand(@Param('id') id: string) {
    return this.brandsService.findOneBrand(id);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @UseInterceptors(FileInterceptor('logo'))
  @Patch(':id')
  updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: 'image/(jpeg|png|jpg)',
            skipMagicNumbersValidation: true,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    brandLogo: Express.Multer.File,
  ) {
    return this.brandsService.updateBrand(id, updateBrandDto, brandLogo);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @Delete(':id')
  removeBrand(@Param('id') id: string) {
    return this.brandsService.removeBrand(id);
  }
}
