import { NgModule } from '@angular/core';

import { RouterExtensions } from './services/router-extensions.service';
import { StoreService } from './services/store.service';

@NgModule()
export class CoreModule {
  providers: [RouterExtensions, StoreService];
}
