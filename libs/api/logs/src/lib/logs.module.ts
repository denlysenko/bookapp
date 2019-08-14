import { DataLoadersModule } from '@bookapp/api/dataloaders';
import { ModelNames } from '@bookapp/api/shared';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LogsResolver } from './logs.resolver';
import { LogsService } from './logs.service';
import { LogSchema } from './schemas/log';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.LOG, schema: LogSchema }]),
    DataLoadersModule
  ],
  providers: [LogsService, LogsResolver],
  exports: [LogsService]
})
export class LogsModule {}
