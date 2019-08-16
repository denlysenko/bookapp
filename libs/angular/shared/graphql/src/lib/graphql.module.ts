import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  Environment,
  FeedbackPlatformService,
  StoragePlatformService,
  WebSocketImpl
} from '@bookapp/angular/shared/core';

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
        WebSocketImpl,
        FeedbackPlatformService,
        Environment
      ]
    }
  ]
})
export class GraphQLModule {}
