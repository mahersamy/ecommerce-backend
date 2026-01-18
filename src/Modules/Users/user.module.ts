import { Module } from '@nestjs/common';
import { UserRepository } from 'src/DB/Repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/DB/Models/users.model';
import { HashService } from 'src/common';
import { EncryptionService } from 'src/common';
import { TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    HashService,
    EncryptionService,
    TokenService,
    JwtService,
  ],
})
export class UserModule {
  
}
