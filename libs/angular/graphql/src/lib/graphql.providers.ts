import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import {
  FeedbackPlatformService,
  StoragePlatformService,
  StoreService,
} from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { AUTH_TOKEN, HTTP_STATUS, REFRESH_TOKEN_HEADER } from '@bookapp/shared/constants';
import { AuthPayload, EnvConfig } from '@bookapp/shared/interfaces';

import { HttpLink } from 'apollo-angular/http';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import * as jwtDecode from 'jwt-decode';

interface Definition {
  kind: string;
  operation?: string;
}

const defaultOptions = {
  watchQuery: {
    errorPolicy: 'all',
  },
  query: {
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

// tslint:disable-next-line: cognitive-complexity
export function createApolloFactory(
  httpLink: HttpLink,
  storageService: StoragePlatformService,
  storeService: StoreService,
  webSocketImpl: any,
  environment: EnvConfig,
  httpClient: HttpClient,
  injector: Injector
) {
  const http = httpLink.create({
    uri: ({ operationName }) =>
      (window as any).Cypress
        ? `${environment.endpointUrl}?${operationName}`
        : environment.endpointUrl,
  });

  const ws = new WebSocketLink({
    uri: environment.subscriptionsEndpoint,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: storeService.get(AUTH_TOKEN),
      },
    },
    webSocketImpl,
  });

  const auth = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: new HttpHeaders().set('Authorization', `Bearer ${storeService.get(AUTH_TOKEN)}`),
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
    const feedbackService = injector.get(FeedbackPlatformService);

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
        error.extensions &&
        error.extensions.exception &&
        error.extensions.exception.response &&
        error.extensions.exception.response.statusCode === HTTP_STATUS.UNAUTHORIZED
      ) {
        const authService = injector.get(AuthService);

        feedbackService.error(error.extensions.exception.response.error); // check and replace on response.message
        authService.logout().subscribe();
        return;
      }

      if (
        error.extensions &&
        error.extensions.exception &&
        error.extensions.exception.response &&
        error.extensions.exception.response.statusCode === HTTP_STATUS.FORBIDDEN
      ) {
        feedbackService.error(error.extensions.exception.response.error);
        return;
      }
    }
  });

  const retryLink = new RetryLink({
    delay: {
      initial: 1000,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 5,
      retryIf: (error) =>
        error.status === HTTP_STATUS.SERVICE_UNAVAILABLE ||
        error.status === HTTP_STATUS.GATEWAY_TIMEOUT,
    },
  });

  const refreshTokenLink: any = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = storeService.get(AUTH_TOKEN);

      if (!token) {
        return true;
      }

      try {
        const { exp } = jwtDecode(token);
        return Date.now() < exp * 1000;
      } catch (err) {
        return false;
      }
    },
    fetchAccessToken: () => {
      return httpClient
        .post<Response>(environment.refreshTokenUrl, null, {
          headers: new HttpHeaders().set(REFRESH_TOKEN_HEADER, storageService.getItem(AUTH_TOKEN)),
        })
        .toPromise();
    },
    handleResponse: () => (response: AuthPayload) => {
      storageService.setItem(AUTH_TOKEN, response.refreshToken);
      return response;
    },
    handleFetch: (accessToken) => {
      storeService.set(AUTH_TOKEN, accessToken);
    },
  });

  return {
    link: ApolloLink.from([refreshTokenLink, errorLink, retryLink, link]),
    cache: new InMemoryCache(),
    defaultOptions,
  };
}
