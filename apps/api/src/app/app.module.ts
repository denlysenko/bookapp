import { AuthModule } from '@bookapp/api/auth';
import { BookmarksModule } from '@bookapp/api/bookmarks';
import { ConfigModule } from '@bookapp/api/config';
import { DatabaseModule } from '@bookapp/api/database';
import { GraphqlModule } from '@bookapp/api/graphql';
import { LogsModule } from '@bookapp/api/logs';
import { UsersModule } from '@bookapp/api/users';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GraphqlModule,
    AuthModule,
    UsersModule,
    LogsModule,
    BookmarksModule
  ]
})
export class AppModule {}
