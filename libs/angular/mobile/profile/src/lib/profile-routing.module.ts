import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { ProfilePageComponent } from './containers/profile-page/profile-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class ProfileRoutingModule {}
