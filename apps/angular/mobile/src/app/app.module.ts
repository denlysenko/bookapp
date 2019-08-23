import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import {
  CoreModule,
  Environment,
  FeedbackPlatformService,
  RouterExtensions,
  StoragePlatformService,
  WebSocketImpl
} from '@bookapp/angular/core';
import { GraphQLModule } from '@bookapp/angular/graphql';

import { NativeScriptAnimationsModule } from 'nativescript-angular/animations';
import { registerElement } from 'nativescript-angular/element-registry';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { RouterExtensions as TNSRouterExtensions } from 'nativescript-angular/router';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';

import { environment } from '../../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemDetailComponent } from './item/item-detail.component';
import { ItemsComponent } from './item/items.component';
import { FeedbackService } from './services/feedback.service';
import { LoaderService } from './services/loader.service';
import { StorageService } from './services/storage.service';

// tslint:disable-next-line: no-var-requires
require('nativescript-websockets');

registerElement(
  'PreviousNextView',
  () => require('nativescript-iqkeyboardmanager').PreviousNextView
);

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    NativeScriptHttpClientModule,
    NativeScriptAnimationsModule,
    TNSFontIconModule.forRoot({
      mdi: './assets/material-design-icons.css'
    }),
    CoreModule,
    GraphQLModule
  ],
  declarations: [AppComponent, ItemsComponent, ItemDetailComponent],
  providers: [
    LoaderService,
    {
      provide: WebSocketImpl,
      useValue: WebSocket
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
      provide: RouterExtensions,
      useClass: TNSRouterExtensions
    },
    {
      provide: FeedbackPlatformService,
      useClass: FeedbackService
    }
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}