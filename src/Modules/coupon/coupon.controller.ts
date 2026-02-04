import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthApply } from '../../common/Decorators/authApply.decorator';
import { AuthUser, Role } from '../../common';
import type { UserDocument } from '../../DB/Models/users.model';

@AuthApply({ roles: [Role.ADMIN] })
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  create(
    @Body() createCouponDto: CreateCouponDto,
    @AuthUser() user: UserDocument,
  ) {
    return this.couponService.create(createCouponDto, user);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @AuthApply({ roles: [] })
  @Get('active')
  getActiveCoupons() {
    return this.couponService.getActiveCoupons();
  }

  @AuthApply({ roles: [] })
  @Post('validate/:code')
  validateCoupon(@Param('code') code: string, @AuthUser() user: UserDocument) {
    return this.couponService.validateCoupon(code, user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.couponService.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.couponService.activate(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
