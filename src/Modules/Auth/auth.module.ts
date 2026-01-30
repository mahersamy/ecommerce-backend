import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/DB/Repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/DB/Models/users.model';
import { HashService } from 'src/common';
import { EncryptionService } from 'src/common';
import { TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { OtpRepository } from 'src/DB/Repository/otp.repository';
import { OtpSchema } from 'src/DB/Models/otp.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Otp', schema: OtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpRepository,
    UserRepository,
    HashService,
    EncryptionService,
    TokenService,
    JwtService,
  ],
})
export class AuthModule {}
