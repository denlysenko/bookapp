import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import {
  Environment,
  FeedbackPlatformService,
  PaymentRequestPlatformService,
  StoragePlatformService,
  UploadPlatformService,
  WebSocketImpl,
  WINDOW,
} from '@bookapp/angular/core';
import { provideGraphql } from '@bookapp/angular/graphql';
import { authErrorInterceptor } from '@bookapp/angular/shared';
import { environment } from '@bookapp/shared/environments';

import { routes } from './app.routes';
import { FeedbackService } from './services/feedback.service';
import { PaymentRequestService } from './services/payment-request.service';
import { StorageService } from './services/storage.service';
import { UploadService } from './services/upload.service';

// TODO: ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideHttpClient(withInterceptors([authErrorInterceptor])),
    provideRouter(routes),
    provideGraphql(),
    {
      provide: WebSocketImpl,
      useValue: null,
    },
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: WINDOW,
      useValue: window,
    },
    {
      provide: StoragePlatformService,
      useClass: StorageService,
    },
    {
      provide: FeedbackPlatformService,
      useClass: FeedbackService,
    },
    {
      provide: UploadPlatformService,
      useClass: UploadService,
    },
    {
      provide: PaymentRequestPlatformService,
      useClass: PaymentRequestService,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3500,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      },
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ],
};
