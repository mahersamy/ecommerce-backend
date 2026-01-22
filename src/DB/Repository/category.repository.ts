import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../Models/category.model';

export class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    model: Model<CategoryDocument>,
  ) {
    super(model);
  }

 async findAllWithBrands() {
    return this.model.aggregate([
      {
        $lookup: {
          from: 'brands',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  // ✅ Convert categoryIds strings to ObjectIds before comparing
                  $in: [
                    '$$categoryId',
                    {
                      $map: {
                        input: '$categoryIds',
                        as: 'catId',
                        in: { $toObjectId: '$$catId' }
                      }
                    }
                  ]
                },
              },
            },
          ],
          as: 'brands',
        },
      },
    ]).exec();
  }
}
