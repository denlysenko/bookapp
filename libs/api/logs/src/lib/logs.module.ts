import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LogsService } from './logs.service';
import { LogSchema } from './schemas/log';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }])],
  providers: [LogsService],
  exports: [LogsService]
})
export class LogsModule {}
