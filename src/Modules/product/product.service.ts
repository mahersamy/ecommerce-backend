import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from '../../DB/Repository/product.repository';
import { BrandRepository } from '../../DB/Repository/brand.repository';
import { CategoryRepository } from '../../DB/Repository/category.repository';
import { CloudinaryService } from '../../common/services/cloudinary/cloudinary.service';
import { UserDocument } from '../../DB/Models/users.model';
import { Types } from 'mongoose';
import { DeleteProductImageDto } from './dto/delete-product-image.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createProductDto: CreateProductDto, user: UserDocument) {
    const { brand, category, title } = createProductDto;
    const finalPrice =
      createProductDto.price -
      (createProductDto.price * createProductDto.discount) / 100;

    // Validate Category
    const categoryExists = await this.categoryRepository.findById(category);
    if (!categoryExists) {
      throw new BadRequestException('Invalid category ID');
    }

    // Validate Brand
    const brandExists = await this.brandRepository.findById(brand);
    if (!brandExists) {
      throw new BadRequestException('Invalid brand ID');
    }

    // Check availability
    const productExists = await this.productRepository.findOne({ title });
    if (productExists) {
      throw new BadRequestException('Product with this title already exists');
    }

    // Create Product
    const newProduct = await this.productRepository.create({
      ...createProductDto,
      finalPrice,
      createdBy: user._id as Types.ObjectId,
    });

    return newProduct;
  }

  async findAll() {
    // const cachedProducts = await this.cacheManager.get('products');
    // if (cachedProducts) {
    //   console.log('cachedProducts : ');
    //   return cachedProducts;
    // }
    const products = await this.productRepository.find();
    // await this.cacheManager.set('products', products);
    return products;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findByIdWithPopulate(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { brand, category, title } = updateProductDto;

    // Validate Category
    if (category) {
      const categoryExists = await this.categoryRepository.findById(category);
      if (!categoryExists) {
        throw new BadRequestException('Invalid category ID');
      }
    }

    // Validate Brand
    if (brand) {
      const brandExists = await this.brandRepository.findById(brand);
      if (!brandExists) {
        throw new BadRequestException('Invalid brand ID');
      }
    }

    // Check title uniqueness
    if (title && title !== product.title) {
      const productExists = await this.productRepository.findOne({ title });
      if (productExists) {
        throw new BadRequestException('Product with this title already exists');
      }
    }

    return this.productRepository.findByIdAndUpdate(id, {
      ...updateProductDto,
      finalPrice: product.finalPrice,
    });
  }

  async remove(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((image) =>
          this.cloudinaryService.deleteFile(image.public_id),
        ),
      );
    }

    await this.productRepository.findByIdAndDelete(id);
    return { message: 'Product deleted successfully' };
  }

  async addImages(id: string, images: Express.Multer.File[]) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!images || images.length === 0) {
      throw new BadRequestException('No images provided');
    }

    const cloudinaryResponses = await this.cloudinaryService.uploadFiles(
      images,
      {
        folder: 'products',
        quality: 60,
        toWebp: true,
      },
    );

    const newImages = cloudinaryResponses.map((res) => ({
      secure_url: res.secure_url,
      public_id: res.public_id,
    }));

    const updatedImages = [...product.images, ...newImages];

    return this.productRepository.findByIdAndUpdate(id, {
      images: updatedImages as any,
    });
  }

  async deleteImage(id: string, body: DeleteProductImageDto) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const imageExists = product.images.find(
      (img) => img._id.toString() === body.imageId.toString(),
    );
    if (!imageExists) {
      throw new NotFoundException('Image not found in product');
    }

    // Remove from Cloudinary
    await this.cloudinaryService.deleteFile(imageExists.public_id);

    // Filter out the deleted image
    const updatedImages = product.images.filter(
      (img) => img.public_id !== imageExists.public_id,
    );

    await this.productRepository.findByIdAndUpdate(id, {
      images: updatedImages,
    });

    return 'Image deleted successfully';
  }
}
