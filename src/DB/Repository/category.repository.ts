import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "../Models/category.model";


export class CategoryRepository extends BaseRepository<CategoryDocument> {
    constructor(
        @InjectModel(Category.name)
        model: Model<CategoryDocument>,
    ) {
        super(model);
    }
}