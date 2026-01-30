import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-wishlist.dto';
import { AuthApply } from 'src/common/Decorators/authApply.decorator';
import { AuthUser } from 'src/common/Decorators/authUser.decorator';
import type { UserDocument } from 'src/DB/Models/users.model';

@AuthApply({ roles: [] }) // Available to all authenticated users
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  addToWishlist(
    @Body() addToWishlistDto: AddToWishlistDto,
    @AuthUser() user: UserDocument,
  ) {
    return this.wishlistService.addToWishlist(addToWishlistDto, user);
  }

  @Delete()
  removeFromWishlist(
    @Body() removeFromWishlistDto: RemoveFromWishlistDto,
    @AuthUser() user: UserDocument,
  ) {
    return this.wishlistService.removeFromWishlist(removeFromWishlistDto, user);
  }

  @Get()
  getWishlist(@AuthUser() user: UserDocument) {
    return this.wishlistService.getWishlist(user);
  }
}
