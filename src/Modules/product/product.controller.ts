import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthApply } from 'src/common/Decorators/authApply.decorator';
import type { UserDocument } from 'src/DB/Models/users.model';
import {
  AuthUser,
  FilesUpload,
  Role,
  UploadedFilesValidated,
  ParamIdDto,
} from 'src/common';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';
import { GetAllDto } from 'src/common/Dto/get-all.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @AuthApply({ roles: [Role.ADMIN] })
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @AuthUser() user: UserDocument,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @Get()
  async findAll(@Query() query: GetAllDto) {

    
    return this.productService.findAll();
  }

  @Version('2')
  @Get()
  findAllV2() {
    return 'under development';
  }

  @Get(':id')
  findOne(@Param() { id }: ParamIdDto) {
    return this.productService.findOne(id);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @Patch(':id')
  update(
    @Param() { id }: ParamIdDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @Delete(':id')
  remove(@Param() { id }: ParamIdDto) {
    return this.productService.remove(id);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @FilesUpload({ fieldName: 'images' })
  @Patch(':id/images')
  addImages(
    @Param() { id }: ParamIdDto,
    @UploadedFilesValidated() images: Express.Multer.File[],
  ) {
    return this.productService.addImages(id, images);
  }

  @AuthApply({ roles: [Role.ADMIN] })
  @Delete(':id/images')
  deleteImage(
    @Param() { id }: ParamIdDto,
    @Body() body: DeleteProductImageDto,
  ) {
    return this.productService.deleteImage(id, body);
  }
}
