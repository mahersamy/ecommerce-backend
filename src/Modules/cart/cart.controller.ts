import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthApply } from 'src/common/Decorators/authApply.decorator';
import { Role } from 'src/common/Enums/role.enum';
import { AuthUser } from 'src/common/Decorators/authUser.decorator';
import type { UserDocument } from 'src/DB/Models/users.model';
import { RemoveCartDto } from './dto/remove-cart.dto';
import { ParamIdDto } from 'src/common';

@AuthApply({ roles: [] })
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto,  @AuthUser() user:UserDocument ,) {
    return this.cartService.create(createCartDto,user);
  }

  @Delete("remove-from-cart")
  removeFromCart(@Body() removeCartDto: RemoveCartDto, @AuthUser() user:UserDocument) {
    return this.cartService.remove(removeCartDto, user);
  }

  @Get()
  getLoggedCart(@AuthUser() user:UserDocument) {
    return this.cartService.getLoggedCart(user);
  }

  @Patch()
  editCartItem( @Body() updateCartDto: UpdateCartDto, @AuthUser() user:UserDocument) {
    return this.cartService.editCartItem(updateCartDto, user);
  }

  @Delete('clear')
  clearCart(@AuthUser() user: UserDocument) {
    return this.cartService.clearCart(user);
  }
}
