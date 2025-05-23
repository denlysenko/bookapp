import { EnvConfig } from '@bookapp/shared/interfaces';

export const environment: EnvConfig = {
  production: false,
  endpointUrl: 'http://localhost:3000/graphql',
  subscriptionsEndpoint: 'ws://localhost:3000/graphql',
  uploadUrl: 'http://localhost:3000/files',
  refreshTokenUrl: 'http://localhost:3000/refreshTokens',
};
