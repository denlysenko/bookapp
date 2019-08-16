import { ModuleWithProviders, NgModule } from '@angular/core';

import { FeedbackPlatformService } from './services/feedback-platform.service';
import { RouterExtensions } from './services/router-extensions.service';
import { StoragePlatformService } from './services/storage-platform.service';
import { StoreService } from './services/store.service';

// TODO: use InjectionToken
const WebSocketImpl = null;

@NgModule()
export class CoreModule {
  static forRoot({
    WebSocket,
    StorageService,
    FeedbackService
  }): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        RouterExtensions,
        StoreService,
        {
          provide: WebSocketImpl,
          useValue: WebSocket
        },
        {
          provide: StoragePlatformService,
          useClass: StorageService
        },
        {
          provide: FeedbackPlatformService,
          useClass: FeedbackService
        }
      ]
    };
  }
}
