import { Model, ProjectionType, QueryFilter, QueryOptions } from "mongoose";

export abstract class BaseRepository<T> {
    constructor(private readonly model: Model<T>) {}



    // Creation Methods
    async createOne(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }



    // Finds Methods
    async findOne(
        filter: QueryFilter<T>,
        projection?: ProjectionType<T> ,
        options?: QueryOptions<T> 
    ): Promise<T | null>{
        return this.model.findOne(filter, projection, options);
    } 

    async findMany(
        filter: QueryFilter<T>,
        projection?: ProjectionType<T> ,
        options?: QueryOptions<T> 
    ): Promise<T[]>{
        return this.model.find(filter, projection, options);
    }

    async findById(id: string): Promise<T | null>{
        return this.model.findById(id);
    }
    
    


}