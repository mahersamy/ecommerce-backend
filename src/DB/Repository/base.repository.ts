import { Model, ProjectionType, QueryFilter, QueryOptions } from 'mongoose';

export abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  // Creation Methods
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  // Finds Methods
  async findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOne(filter, projection, options);
  }

  async find(
    filter?: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.model.find(filter, projection, options);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  // delete

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
