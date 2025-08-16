import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import * as Sentry from '@sentry/angular';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (!isDevMode()) {
  Sentry.init({
    dsn: 'https://a40d1373e3b6ceeb03706f8778281d07@o4509826217738240.ingest.de.sentry.io/4509849014304848',
    sendDefaultPii: true,
  });
}

bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));
