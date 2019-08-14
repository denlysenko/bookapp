import { Module, Scope } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

import { BooksDataLoader } from './books.dataloader';
import { UsersDataLoader } from './users.dataloader';

@Module({
  providers: [
    {
      provide: UsersDataLoader,
      useFactory: UsersDataLoader.create,
      inject: [getConnectionToken()],
      scope: Scope.REQUEST
    },
    {
      provide: BooksDataLoader,
      useFactory: BooksDataLoader.create,
      inject: [getConnectionToken()],
      scope: Scope.REQUEST
    }
  ],
  exports: [UsersDataLoader, BooksDataLoader]
})
export class DataLoadersModule {}
