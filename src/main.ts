import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig, CorsConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Get config service (type-safe access)
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app')!;
  const corsConfig = configService.get<CorsConfig>('cors')!;

  // Global prefix from config
  app.setGlobalPrefix(appConfig.apiPrefix);

  // CORS from config
  if (corsConfig.enabled) {
    app.enableCors({
      origin: corsConfig.origin,
      methods: corsConfig.methods,
      allowedHeaders: corsConfig.allowedHeaders,
      exposedHeaders: corsConfig.exposedHeaders,
      credentials: corsConfig.credentials,
      maxAge: corsConfig.maxAge,
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );


  // Swagger setup (only in non-production)
  if (appConfig.nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${appConfig.name} API`)
      .setDescription('Admin Panel API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('admin', 'Admin management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${appConfig.apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // Start server
  await app.listen(appConfig.port);

  logger.log(`🚀 Application: ${appConfig.name}`);
  logger.log(`🌍 Environment: ${appConfig.nodeEnv}`);
  logger.log(`🔗 URL: http://localhost:${appConfig.port}`);
  if (appConfig.nodeEnv !== 'production') {
    logger.log(`📚 Swagger: http://localhost:${appConfig.port}/${appConfig.apiPrefix}/docs`);
  }
}

bootstrap();
