import { CommentsModule } from '@bookapp/api/comments';
import { FilesModule } from '@bookapp/api/files';
import { LogsModule } from '@bookapp/api/logs';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksResolvers } from './books.resolver';
import { BooksService } from './books.service';
import { BOOK_MODEL_NAME } from './constants';
import { BookSchema } from './schemas/book';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BOOK_MODEL_NAME, schema: BookSchema }]),
    FilesModule,
    CommentsModule,
    LogsModule
  ],
  providers: [BooksService, BooksResolvers],
  exports: [BooksService]
})
export class BooksModule {}
