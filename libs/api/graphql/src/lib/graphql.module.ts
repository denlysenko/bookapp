import { BooksDataLoader, UsersDataLoader } from '@bookapp/api/dataloaders';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { getConnectionToken } from '@nestjs/mongoose';

import { PubSub } from 'graphql-subscriptions';
import { Connection } from 'mongoose';

import { PUB_SUB } from './constants';

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (connectionToken: Connection) => ({
        debug: process.env.NODE_ENV !== 'production',
        graphiql: process.env.NODE_ENV !== 'production',
        typePaths: ['./**/*.graphql'],
        context: ({ req, connection }) =>
          connection
            ? { req: { headers: connection.context } }
            : {
                req,
                usersLoader: UsersDataLoader.create(connectionToken),
                booksLoader: BooksDataLoader.create(connectionToken),
              },
        subscriptions: {
          'graphql-ws': true,
        },
        formatError: (error) => {
          delete error.extensions?.stacktrace;
          return error;
        },
      }),
      inject: [getConnectionToken()],
    }),
  ],
  providers: [
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [PUB_SUB],
})
export class GraphqlModule {}
