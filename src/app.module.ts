// Core
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// Modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/Middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UnifinedResponseInterceptor } from './common';
import {
  AuthModule,
  BrandsModule,
  UserModule,
} from './Modules/feature.modules';
import { GlobalModule } from './Modules/global.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CloudinaryProvider } from './common/services/cloudinary/cloudinary.provider';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    UserModule,
    BrandsModule,

    // Database
    MongooseModule.forRoot(process.env.DATABASE_URI as string),

    // serve static files
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   serveRoot: '/uploads',
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifinedResponseInterceptor,
    },

    // Cloudinary
    CloudinaryProvider,
  ],
})
export class AppModule implements NestModule {
  // Middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
