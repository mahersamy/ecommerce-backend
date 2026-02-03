import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from 'src/common';
import { User, UserSchema } from 'src/DB/Models/users.model';
import { UserRepository } from 'src/DB/Repository/user.repository';
import { OrdersModule } from './orders/orders.module';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OrdersModule,
  ],
  providers: [UserRepository, TokenService, JwtService],
  exports: [UserRepository, TokenService, JwtService],
})
export class GlobalModule {}
