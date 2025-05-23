import { InjectionToken } from '@angular/core';

import { EnvConfig } from '@bookapp/shared/interfaces';

declare global {
  interface Window {
    Cypress: unknown;
  }
}

export const WebSocketImpl = new InjectionToken('WebSocketImpl');
export const Environment = new InjectionToken<EnvConfig>('Environment');
export const WINDOW = new InjectionToken<Window>('Window');
