import { EnvConfig } from '@bookapp/angular/core';

export const environment: EnvConfig = {
  production: false,
  endpointUrl: 'http://localhost:3333/graphql',
  subscriptionsEndpoint: 'ws://localhost:3333/graphql',
  uploadUrl: 'http://localhost:3333/files',
  refreshTokenUrl: 'http://localhost:3333/refreshTokens'
};
