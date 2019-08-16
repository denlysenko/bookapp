import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {
  CoreModule,
  Environment,
  FeedbackPlatformService,
  StoragePlatformService,
  WebSocketImpl
} from '@bookapp/angular/shared/core';
import { GraphQLModule } from '@bookapp/angular/shared/graphql';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { FeedbackService } from './services/feedback.service';
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    GraphQLModule,
    MatSnackBarModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' })
  ],
  providers: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
