import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LOG_MODEL_NAME } from './constants';
import { LogsResolver } from './logs.resolver';
import { LogsService } from './logs.service';
import { LogSchema } from './schemas/log';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LOG_MODEL_NAME, schema: LogSchema }])
  ],
  providers: [LogsService, LogsResolver],
  exports: [LogsService]
})
export class LogsModule {}
