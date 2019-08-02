import { formatError } from '@bookapp/api/utils';

import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { PubSub } from 'graphql-subscriptions';

import { PUB_SUB } from './constants';

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
      formatError,
      installSubscriptionHandlers: true
    })
  ],
  providers: [
    {
      provide: PUB_SUB,
      useValue: new PubSub()
    }
  ],
  exports: [PUB_SUB]
})
export class GraphqlModule {}
