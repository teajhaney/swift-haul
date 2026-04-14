import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser') as typeof import('cookie-parser');

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  // whitelist strips unknown fields, forbidNonWhitelisted rejects them, transform casts to DTO types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SwiftHaul API')
    .setDescription('SwiftHaul logistics & delivery platform API')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .addCookieAuth('refreshToken')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`SwiftHaul API running on http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
