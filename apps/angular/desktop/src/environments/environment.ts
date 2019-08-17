import { EnvConfig } from '@bookapp/angular/core';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: EnvConfig = {
  production: false,
  endpointUrl: 'https://bookapp-api.herokuapp.com/graphql',
  subscriptionsEndpoint: 'wss://bookapp-api.herokuapp.com/graphql',
  uploadUrl:
    'https://api-bookapp-api.7e14.starter-us-west-2.openshiftapps.com/api/files'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
