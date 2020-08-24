import { InjectionToken } from '@angular/core';

export const WebSocketImpl = new InjectionToken('WebSocketImpl');
export const Environment = new InjectionToken('Environment');

export const AUTH_TOKEN = 'ba_auth_token';

export const HTTP_STATUS = {
  NO_CONNECTION: 0,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  BAD_GATEWAY: 502,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  OK: 200,
  CREATED: 201,
};

export const DEFAULT_LIMIT = 10;
