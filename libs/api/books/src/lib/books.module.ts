import { CommentsModule } from '@bookapp/api/comments';
import { FilesModule } from '@bookapp/api/files';
import { LogsModule } from '@bookapp/api/logs';
import { ModelNames } from '@bookapp/api/shared';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksResolvers } from './books.resolver';
import { BooksService } from './books.service';
import { BookSchema } from './schemas/book';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.BOOK, schema: BookSchema }]),
    FilesModule,
    CommentsModule,
    LogsModule,
  ],
  providers: [BooksService, BooksResolvers],
  exports: [BooksService],
})
export class BooksModule {}
