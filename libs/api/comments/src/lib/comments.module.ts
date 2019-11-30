import { DataLoadersModule } from '@bookapp/api/dataloaders';
import { LogsModule } from '@bookapp/api/logs';
import { ModelNames } from '@bookapp/api/shared';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { CommentSchema } from './schemas/comment';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.COMMENT, schema: CommentSchema }]),
    LogsModule,
    DataLoadersModule
  ],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService]
})
export class CommentsModule {}
