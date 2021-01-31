import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import {
  CoreModule,
  Environment,
  FeedbackPlatformService,
  LoaderPlatformService,
  RouterExtensions,
  StoragePlatformService,
  UploadPlatformService,
  WebSocketImpl,
  WINDOW,
} from '@bookapp/angular/core';
import { DataAccessModule } from '@bookapp/angular/data-access';
import { GraphQLModule } from '@bookapp/angular/graphql';
import { AuthModule } from '@bookapp/angular/mobile/auth';
import { BrowseBooksModule } from '@bookapp/angular/mobile/books/browse-books';
import { MainLayoutModule } from '@bookapp/angular/mobile/main-layout';
import { AuthGuard } from '@bookapp/angular/shared';
import { environment } from '@bookapp/shared/environments';

import {
  NativeScriptAnimationsModule,
  registerElement,
  NativeScriptHttpClientModule,
  NativeScriptModule,
  RouterExtensions as TNSRouterExtensions,
} from '@nativescript/angular';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedbackService } from './services/feedback.service';
import { LoaderService } from './services/loader.service';
import { StorageService } from './services/storage.service';
import { UploadService } from './services/upload.service';

// tslint:disable-next-line: no-var-requires
const WS = require('nativescript-websockets');

registerElement(
  'PreviousNextView',
  () => require('@nativescript/iqkeyboardmanager').PreviousNextView
);

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule,
    NativeScriptAnimationsModule,
    TNSFontIconModule.forRoot({
      mdi: './assets/material-design-icons.css',
    }),
    CoreModule,
    GraphQLModule,
    DataAccessModule,
    AuthModule,
    MainLayoutModule,
    BrowseBooksModule,
  ],
  declarations: [AppComponent],
  providers: [
    LoaderService,
    AuthGuard,
    {
      provide: WebSocketImpl,
      useValue: WS,
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
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
