// Core
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// Modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/Middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UnifinedResponseInterceptor, TimeoutInterceptor } from './common';
import {
  AuthModule,
  BrandsModule,
  CategoriesModule,
  UserModule,
  ProductModule,
  CartModule,
  WishlistModule,
  CouponModule,
} from './Modules/feature.modules';
import { GlobalModule } from './Modules/global.module';
import { CloudinaryProvider } from './common/services/cloudinary/cloudinary.provider';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    UserModule,
    BrandsModule,
    CategoriesModule,
    ProductModule,
    CartModule,
    WishlistModule,
    CouponModule,

    // Database
    MongooseModule.forRoot(process.env.DATABASE_URI as string),

    // Cache module
    // CacheModule.register({
    //   isGlobal: true,
    //   ttl: 60 * 60 * 1000, // 1 hour
    //   max: 100,
    // }),

    // New version - supported
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            // Redis store (Shared)
            new Keyv({
              store: new KeyvRedis(process.env.REDIS_URI),
              ttl: 10 * 60 * 1000, // 10 minutes
            }),
          ],
        };
      },
    }),

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
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
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
