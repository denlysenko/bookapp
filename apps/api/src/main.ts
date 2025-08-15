import './instrument';

import { MongooseValidationFilter } from '@bookapp/api/shared';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { Response } from 'express';

import { AppModule } from './app/app.module';
import { SentryLogger } from './app/sentry-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ? parseInt(configService.get('PORT'), 10) : 3000;
  const host = (configService.get('HOST') as string) ?? 'localhost';

  app.useLogger(app.get(SentryLogger));
  app.useGlobalFilters(new MongooseValidationFilter());
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4300'],
  });

  app.use('/ping', (_: unknown, res: Response) => {
    res.send('ok');
  });

  await app.listen(port, host);

  Logger.log(`Listening at ${await app.getUrl()}`);

  const closeGracefully = async (signal: string): Promise<void> => {
    Logger.log(`Received signal to terminate: ${signal}`);
    await app.close();
    process.exit(0);
  };

  process.once('SIGINT', closeGracefully);
  process.once('SIGTERM', closeGracefully);
}

bootstrap();
