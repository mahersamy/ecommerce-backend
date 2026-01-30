import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUser, Role, tokenTypeEnum } from 'src/common';

import { User } from 'src/DB/Models/users.model';
import { AuthApply } from 'src/common/Decorators/authApply.decorator';
import { UserProfileResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@AuthApply({ tokenType: tokenTypeEnum.Access, roles: [Role.ADMIN] })
@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('profile')
  profile(@AuthUser() user: User): UserProfileResponseDto {
    return plainToInstance(UserProfileResponseDto, user,{excludeExtraneousValues: true,});
  }
}
