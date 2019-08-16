import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  Environment,
  FeedbackPlatformService,
  StoragePlatformService
} from '@bookapp/angular/shared/core';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';

import { createApolloFactory, WebSocketImpl } from './graphql.providers';

@NgModule({
  imports: [ApolloModule, HttpLinkModule]
})
export class GraphQLModule {
  static forRoot(environment: Environment): ModuleWithProviders {
    return {
      ngModule: GraphQLModule,
      providers: [
        {
          provide: APOLLO_OPTIONS,
          useFactory: createApolloFactory,
          deps: [
            HttpLink,
            StoragePlatformService,
            WebSocketImpl,
            FeedbackPlatformService,
            environment
          ]
        }
      ]
    };
  }
}
