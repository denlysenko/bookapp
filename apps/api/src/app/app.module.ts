import { AuthModule } from '@bookapp/api/auth';
import { ConfigModule } from '@bookapp/api/config';
import { DatabaseModule } from '@bookapp/api/database';
import { GraphqlModule } from '@bookapp/api/graphql';
import { UsersModule } from '@bookapp/api/users';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GraphqlModule,
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
