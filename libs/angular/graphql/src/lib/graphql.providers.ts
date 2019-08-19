import { HttpHeaders } from '@angular/common/http';

import {
  AUTH_TOKEN,
  EnvConfig,
  FeedbackPlatformService,
  HTTP_STATUS,
  StoragePlatformService
} from '@bookapp/angular/core';

import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

interface Definition {
  kind: string;
  operation?: string;
}

const defaultOptions = {
  watchQuery: {
    errorPolicy: 'all'
  },
  query: {
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  }
};

// tslint:disable-next-line: cognitive-complexity
export function createApolloFactory(
  httpLink: HttpLink,
  storageService: StoragePlatformService,
  webSocketImpl: any,
  feedbackService: FeedbackPlatformService,
  environment: EnvConfig
) {
  const http = httpLink.create({
    uri: environment.endpointUrl
  });

  const ws = new WebSocketLink({
    uri: environment.subscriptionsEndpoint,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: storageService.getItem(AUTH_TOKEN)
      }
    },
    webSocketImpl
  });

  const auth = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${storageService.getItem(AUTH_TOKEN)}` || null
      )
    });

    return forward(operation);
  });

  const link = split(
    ({ query }) => {
      const { kind, operation }: Definition = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    ws,
    auth.concat(http)
  );

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (networkError) {
      let msg: string;

      switch (networkError['status']) {
        case HTTP_STATUS.NO_CONNECTION:
          msg = 'No connection. Please, try again later.';
          break;
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
        case HTTP_STATUS.GATEWAY_TIMEOUT:
          msg = `${networkError['statusText']}. Retrying...`;
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS.BAD_GATEWAY:
          msg = `${networkError['statusText']}.`;
          break;
      }

      if (msg) {
        feedbackService.error(msg);
      }
    }

    if (graphQLErrors) {
      const [error] = graphQLErrors;

      if (
        error.extensions.exception.response.statusCode ===
        HTTP_STATUS.UNAUTHORIZED
      ) {
        // TODO: redirect to login page
        feedbackService.error(error.extensions.exception.response.error);
      }

      if (
        error.extensions.exception.response.statusCode === HTTP_STATUS.FORBIDDEN
      ) {
        feedbackService.error(error.extensions.exception.response.error);
      }
    }
  });

  const retryLink = new RetryLink({
    delay: {
      initial: 1000,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: 5,
      retryIf: error =>
        error.status === HTTP_STATUS.SERVICE_UNAVAILABLE ||
        error.status === HTTP_STATUS.GATEWAY_TIMEOUT
    }
  });

  return {
    link: ApolloLink.from([errorLink, retryLink, link]),
    cache: new InMemoryCache(),
    defaultOptions
  };
}
