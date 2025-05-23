import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';

mongoose.set('debug', process.env.NODE_ENV !== 'production');

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
