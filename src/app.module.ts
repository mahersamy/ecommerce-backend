// Core
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// Modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/Middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Modules/Auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UnifinedResponseInterceptor } from './common';
import { UserModule } from './Modules/Users/user.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forRoot(process.env.DATABASE_URI as string),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifinedResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
