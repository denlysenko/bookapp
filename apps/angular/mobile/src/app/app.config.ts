import { withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import {
  Environment,
  FeedbackPlatformService,
  LoaderPlatformService,
  RouterExtensions,
  StoragePlatformService,
  UploadPlatformService,
  WebSocketImpl,
  WINDOW,
} from '@bookapp/angular/core';
import { provideGraphql } from '@bookapp/angular/graphql';
import { authErrorInterceptor } from '@bookapp/angular/shared';
import { environment } from '@bookapp/shared/environments';

import {
  NativeScriptAnimationsModule,
  provideNativeScriptHttpClient,
  provideNativeScriptNgZone,
  provideNativeScriptRouter,
  RouterExtensions as TNSRouterExtensions,
} from '@nativescript/angular';
import { FontIconModule } from 'nativescript-fonticon/angular';

import { routes } from './app.routes';
import { FeedbackService } from './services/feedback.service';
import { LoaderService } from './services/loader.service';
import { StorageService } from './services/storage.service';
import { UploadService } from './services/upload.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(NativeScriptAnimationsModule),
    importProvidersFrom(
      FontIconModule.forRoot({
        mdi: './assets/material-design-icons.css',
      })
    ),
    provideNativeScriptHttpClient(withInterceptors([authErrorInterceptor])),
    provideNativeScriptRouter(routes),
    provideNativeScriptNgZone(),
    provideGraphql(),
    {
      provide: WebSocketImpl,
      useValue: WebSocket,
    },
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: WINDOW,
      useValue: null,
    },
    {
      provide: StoragePlatformService,
      useClass: StorageService,
    },
    {
      provide: RouterExtensions,
      useClass: TNSRouterExtensions,
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
      provide: LoaderPlatformService,
      useClass: LoaderService,
    },
  ],
};
