import { AuthTokensModule } from '@bookapp/api/auth-tokens';
import { FilesModule } from '@bookapp/api/files';
import { ModelNames } from '@bookapp/api/shared';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from './schemas/user';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.USER, schema: UserSchema }]),
    FilesModule,
    AuthTokensModule
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}
