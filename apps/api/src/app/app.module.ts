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

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'testing'
    ? '.env.testing'
    : '.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true
    }),
    DatabaseModule,
    GraphqlModule,
    AuthModule,
    UsersModule,
    LogsModule,
    BookmarksModule,
    BooksModule,
    CommentsModule
  ]
})
export class AppModule {}
