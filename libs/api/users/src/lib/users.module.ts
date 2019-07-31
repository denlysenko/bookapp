import { FilesModule } from '@bookapp/api/files';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    FilesModule
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}
