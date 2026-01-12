// Core
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// Modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/Middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Modules/Auth/auth.module';

@Module({
  imports: [AuthModule,MongooseModule.forRoot(process.env.DATABASE_URI as string)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
