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
import { APP_FILTER } from '@nestjs/core';

import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

import { SentryLogger } from './sentry-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SentryModule.forRoot(),
    DatabaseModule,
    GraphqlModule,
    AuthModule,
    UsersModule,
    LogsModule,
    BookmarksModule,
    BooksModule,
    CommentsModule,
  ],
  providers: [
    SentryLogger,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
