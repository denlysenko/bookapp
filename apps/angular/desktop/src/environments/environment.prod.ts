import { EnvConfig } from '@bookapp/angular/core';

export const environment: EnvConfig = {
  production: true,
  endpointUrl: 'https://bookapp-api.herokuapp.com/graphql',
  subscriptionsEndpoint: 'wss://bookapp-api.herokuapp.com/graphql',
  uploadUrl: 'https://bookapp-api.herokuapp.com/files',
  refreshTokenUrl: 'https://bookapp-api.herokuapp.com/refreshTokens'
};
