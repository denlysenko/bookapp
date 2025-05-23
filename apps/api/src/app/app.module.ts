import { AuthModule } from '@bookapp/api/auth';
import { BookmarksModule } from '@bookapp/api/bookmarks';
import { BooksModule } from '@bookapp/api/books';
import { CommentsModule } from '@bookapp/api/comments';
import { DatabaseModule } from '@bookapp/api/database';
import { GraphqlModule } from '@bookapp/api/graphql';
import { LogsModule } from '@bookapp/api/logs';
import { UsersModule } from '@bookapp/api/users';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    GraphqlModule,
    AuthModule,
    UsersModule,
    LogsModule,
    BookmarksModule,
    BooksModule,
    CommentsModule,
  ],
})
export class AppModule {}
