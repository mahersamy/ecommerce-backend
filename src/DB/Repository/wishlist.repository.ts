import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import { Wishlist, WishlistDocument } from '../Models/wishlist.model';

@Injectable()
export class WishlistRepository extends BaseRepository<WishlistDocument> {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {
    super(wishlistModel);
  }
}
