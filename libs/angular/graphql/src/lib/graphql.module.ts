import { HttpClient } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';

import {
  Environment,
  StoragePlatformService,
  StoreService,
  WebSocketImpl
} from '@bookapp/angular/core';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { createApolloFactory } from './graphql.providers';

@NgModule({
  imports: [ApolloModule, HttpLinkModule],
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
        Injector
      ]
    }
  ]
})
export class GraphQLModule {}
