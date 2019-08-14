import { DataLoadersModule } from '@bookapp/api/dataloaders';
import { LogsModule } from '@bookapp/api/logs';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookmarksResolver } from './bookmarks.resolver';
import { BookmarksService } from './bookmarks.service';
import { BOOKMARK_MODEL_NAME } from './constants';
import { BookmarkSchema } from './schemas/bookmark';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BOOKMARK_MODEL_NAME, schema: BookmarkSchema }
    ]),
    LogsModule,
    DataLoadersModule
  ],
  providers: [BookmarksService, BookmarksResolver]
})
export class BookmarksModule {}
