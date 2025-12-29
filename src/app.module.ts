import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configurations, validateEnvFactory, SecurityConfig } from './config';
import { CoreModule } from './core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    // ============================================
    // Configuration (validated + namespaced)
    // ============================================
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      validate: validateEnvFactory,
      expandVariables: true,
    }),

    // ============================================
    // Core Infrastructure
    // (Database, Redis, Kafka, Mail, SMS)
    // ============================================
    CoreModule,

    // ============================================
    // Rate Limiting
    // ============================================
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const security = configService.get<SecurityConfig>('security')!;
        return [
          {
            ttl: security.rateLimit.ttl,
            limit: security.rateLimit.limit,
          },
        ];
      },
      inject: [ConfigService],
    }),

    // ============================================
    // Feature Modules (add here)
    // ============================================
  ],
  controllers: [AppController],
  providers: [
    AppService,
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
  ],
})
export class AppModule {}