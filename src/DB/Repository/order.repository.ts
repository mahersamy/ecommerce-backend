import { BaseRepository } from "./base.repository";
import { Order, type OrderDocument } from "../Models/orders.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class OrderRepository extends BaseRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) orderModel: Model<OrderDocument>) {
        super(orderModel)
    }
}