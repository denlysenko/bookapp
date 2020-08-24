import { HttpClient } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';

import {
  Environment,
  StoragePlatformService,
  StoreService,
  WebSocketImpl,
} from '@bookapp/angular/core';

import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { createApolloFactory } from './graphql.providers';

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApolloFactory,
      deps: [
        HttpLink,
        StoragePlatformService,
        StoreService,
        WebSocketImpl,
        Environment,
        HttpClient,
        Injector,
      ],
    },
  ],
})
export class GraphQLModule {}
