import { EnvConfig } from '@bookapp/angular/core';

export const environment: EnvConfig = {
  production: true,
  endpointUrl: 'https://bookapp-api.herokuapp.com/graphql',
  subscriptionsEndpoint: 'wss://bookapp-api.herokuapp.com/graphql',
  uploadUrl:
    'https://api-bookapp-api.7e14.starter-us-west-2.openshiftapps.com/api/files'
};
