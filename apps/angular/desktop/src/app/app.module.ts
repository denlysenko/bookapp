import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  CoreModule,
  Environment,
  FeedbackPlatformService,
  StoragePlatformService,
  WebSocketImpl
} from '@bookapp/angular/core';
import { DataAccessModule } from '@bookapp/angular/data-access';
import { AuthModule } from '@bookapp/angular/desktop/auth';
import { MainLayoutModule } from '@bookapp/angular/desktop/main-layout';
import { GraphQLModule } from '@bookapp/angular/graphql';
import { AuthGuard } from '@bookapp/angular/shared';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedbackService } from './services/feedback.service';
import { StorageService } from './services/storage.service';

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
    MainLayoutModule
  ],
  providers: [
    AuthGuard,
    {
      provide: WebSocketImpl,
      useValue: null
    },
    {
      provide: Environment,
      useValue: environment
    },
    {
      provide: StoragePlatformService,
      useClass: StorageService
    },
    {
      provide: FeedbackPlatformService,
      useClass: FeedbackService
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3500,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
