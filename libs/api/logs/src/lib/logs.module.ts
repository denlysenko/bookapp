import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LogsResolver } from './logs.resolver';
import { LogsService } from './logs.service';
import { LogSchema } from './schemas/log';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }])],
  providers: [LogsService, LogsResolver],
  exports: [LogsService]
})
export class LogsModule {}
