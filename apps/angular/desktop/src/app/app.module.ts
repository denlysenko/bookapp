import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import {
  CoreModule,
  Environment,
  FeedbackPlatformService,
  PaymentRequestPlatformService,
  StoragePlatformService,
  UploadPlatformService,
  WebSocketImpl,
  WINDOW,
} from '@bookapp/angular/core';
import { DataAccessModule } from '@bookapp/angular/data-access';
import { AuthModule } from '@bookapp/angular/desktop/auth';
import { BrowseBooksModule } from '@bookapp/angular/desktop/books/browse-books';
import { MainLayoutModule } from '@bookapp/angular/desktop/main-layout';
import { GraphQLModule } from '@bookapp/angular/graphql';
import { AuthGuard, CanDeactivateGuard, RolesGuard } from '@bookapp/angular/shared';
import { environment } from '@bookapp/shared/environments';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedbackService } from './services/feedback.service';
import { PaymentRequestService } from './services/payment-request.service';
import { StorageService } from './services/storage.service';
import { UploadService } from './services/upload.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    GraphQLModule,
    MatSnackBarModule,
    DataAccessModule,
    AuthModule,
    MainLayoutModule,
    BrowseBooksModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    AuthGuard,
    RolesGuard,
    CanDeactivateGuard,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
