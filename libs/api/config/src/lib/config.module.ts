import { Global, Module } from '@nestjs/common';

import { resolve } from 'path';

import { ConfigService } from './config.service';

const filePath = resolve('libs/api/config/src/lib', './.env');

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(filePath)
    }
  ],
  exports: [ConfigService]
})
export class ConfigModule {}
