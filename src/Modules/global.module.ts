import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from '../common';
import { User, UserSchema } from '../DB/Models/users.model';
import { UserRepository } from '../DB/Repository/user.repository';
import { OrdersModule } from './orders/orders.module';
import { NotificationModule } from './notification/notification.module';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OrdersModule,
    NotificationModule,
  ],
  providers: [UserRepository, TokenService, JwtService],
  exports: [UserRepository, TokenService, JwtService],
})
export class GlobalModule {}
