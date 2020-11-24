import {
  ApolloClient,
  ApolloLink,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import { storage, store } from '@bookapp/react/core';
import { AUTH_TOKEN, HTTP_STATUS, REFRESH_TOKEN_HEADER } from '@bookapp/shared/constants';
import { environment } from '@bookapp/shared/environments';
import { AuthPayload } from '@bookapp/shared/interfaces';

import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import { of } from 'rxjs';

interface Definition {
  kind: string;
  operation?: string;
}

const defaultOptions: DefaultOptions = {
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
export function createApollo(showFeedback: (msg: string) => void) {
  const http = new HttpLink({
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
        authToken: store.get(AUTH_TOKEN),
      },
    },
  });

  const auth = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${store.get(AUTH_TOKEN)}`,
      },
    }));

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
        showFeedback(msg);
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
        // TODO: replace with actual implementation
        const authService = {
          logout: () => of({}),
        };

        showFeedback(error.extensions.exception.response.message);
        authService.logout().subscribe();
        return;
      }

      if (
        error.extensions &&
        error.extensions.exception &&
        error.extensions.exception.response &&
        error.extensions.exception.response.statusCode === HTTP_STATUS.FORBIDDEN
      ) {
        showFeedback(error.extensions.exception.response.error);
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
      const token = store.get(AUTH_TOKEN);

      if (!token) {
        return true;
      }

      try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return Date.now() < exp * 1000;
      } catch (err) {
        return false;
      }
    },
    fetchAccessToken: () => {
      return fetch(environment.refreshTokenUrl, {
        method: 'POST',
        headers: {
          [REFRESH_TOKEN_HEADER]: storage.getItem(AUTH_TOKEN),
        },
      });
    },
    handleResponse: () => (response: AuthPayload) => {
      storage.setItem(AUTH_TOKEN, response.refreshToken);
      return response;
    },
    handleFetch: (accessToken) => {
      store.set(AUTH_TOKEN, accessToken);
    },
  });

  return new ApolloClient({
    link: ApolloLink.from([refreshTokenLink, errorLink, retryLink, link]),
    cache: new InMemoryCache(),
    defaultOptions,
  });
}
