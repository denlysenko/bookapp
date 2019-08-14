import { DataLoadersModule } from '@bookapp/api/dataloaders';
import { LogsModule } from '@bookapp/api/logs';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { COMMENT_MODEL_NAME } from './constants';
import { CommentSchema } from './schemas/comment';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: COMMENT_MODEL_NAME, schema: CommentSchema }
    ]),
    LogsModule,
    DataLoadersModule
  ],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService]
})
export class CommentsModule {}
