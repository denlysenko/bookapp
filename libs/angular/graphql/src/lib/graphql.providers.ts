import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injector } from '@angular/core';

import { ApolloLink, ErrorPolicy, InMemoryCache, ServerError, split } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';

import {
  Environment,
  FeedbackPlatformService,
  StoragePlatformService,
  StoreService,
  WebSocketImpl,
  WINDOW,
} from '@bookapp/angular/core';
import { AuthService } from '@bookapp/angular/data-access';
import { AUTH_TOKEN, HTTP_STATUS, REFRESH_TOKEN_HEADER } from '@bookapp/shared/constants';
import { AuthPayload } from '@bookapp/shared/interfaces';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { createClient } from 'graphql-ws';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';

interface Definition {
  kind: string;
  operation?: string;
}

const defaultOptions = {
  watchQuery: {
    errorPolicy: 'all' as ErrorPolicy,
  },
  query: {
    errorPolicy: 'all' as ErrorPolicy,
  },
  mutate: {
    errorPolicy: 'all' as ErrorPolicy,
  },
};

export function provideGraphql() {
  return [
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const httpClient = inject(HttpClient);
      const environment = inject(Environment);
      const storeService = inject(StoreService);
      const storageService = inject(StoragePlatformService);
      const window = inject(WINDOW);
      const webSocketImpl = inject(WebSocketImpl);
      const feedbackService = inject(FeedbackPlatformService);
      const injector = inject(Injector);

      const http = httpLink.create({
        uri: ({ operationName }) =>
          window && window.Cypress
            ? `${environment.endpointUrl}?${operationName}`
            : environment.endpointUrl,
        withCredentials: true,
      });

      const ws = new GraphQLWsLink(
        createClient({
          url: environment.subscriptionsEndpoint,
          connectionParams: {
            authToken: storeService.get(AUTH_TOKEN),
          },
          webSocketImpl,
        })
      );

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
        const serverError = networkError as ServerError;
        // const feedbackService = injector.get(FeedbackPlatformService);

        if (serverError) {
          let msg = '';

          switch ((serverError as ServerError).statusCode) {
            case HTTP_STATUS.NO_CONNECTION:
              msg = 'No connection. Please, try again later.';
              break;
            case HTTP_STATUS.SERVICE_UNAVAILABLE:
            case HTTP_STATUS.GATEWAY_TIMEOUT:
              msg = `${serverError.response.statusText}. Retrying...`;
              break;
            case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            case HTTP_STATUS.BAD_GATEWAY:
              msg = `${serverError.response.statusText}.`;
              break;
          }

          if (msg) {
            feedbackService.error(msg);
          }
        }

        if (graphQLErrors) {
          const [error] = graphQLErrors;
          const errorCode = (error.extensions as { code: string })?.code;

          if (errorCode === 'UNAUTHENTICATED') {
            const authService = injector.get(AuthService);

            feedbackService.error('UNAUTHENTICATED'); // TODO: add human readable error message
            authService.logout().subscribe();
            return;
          }

          if (errorCode === 'FORBIDDEN') {
            feedbackService.error('FORBIDDEN'); // TODO: add human readable error message
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

      const refreshTokenLink = new TokenRefreshLink({
        accessTokenField: 'accessToken',
        isTokenValidOrUndefined: async () => {
          const token = storeService.get(AUTH_TOKEN);

          if (!token) {
            return true;
          }

          try {
            const { exp } = jwtDecode<{ exp: number }>(token);
            return Date.now() < exp * 1000;
          } catch {
            return false;
          }
        },
        fetchAccessToken: () => {
          return firstValueFrom(
            httpClient.post<Response>(environment.refreshTokenUrl, null, {
              headers: new HttpHeaders().set(
                REFRESH_TOKEN_HEADER,
                storageService.getItem(AUTH_TOKEN)
              ),
            })
          );
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
    }),
  ];
}
