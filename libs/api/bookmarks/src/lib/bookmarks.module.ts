import { DataLoadersModule } from '@bookapp/api/dataloaders';
import { LogsModule } from '@bookapp/api/logs';
import { ModelNames } from '@bookapp/api/shared';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookmarksResolver } from './bookmarks.resolver';
import { BookmarksService } from './bookmarks.service';
import { BookmarkSchema } from './schemas/bookmark';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.BOOKMARK, schema: BookmarkSchema }]),
    LogsModule,
    DataLoadersModule,
  ],
  providers: [BookmarksService, BookmarksResolver],
})
export class BookmarksModule {}
