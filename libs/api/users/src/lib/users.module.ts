import { FilesModule } from '@bookapp/api/files';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { USER_MODEL_NAME } from './constants';
import { UserSchema } from './schemas/user';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }]),
    FilesModule
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}
