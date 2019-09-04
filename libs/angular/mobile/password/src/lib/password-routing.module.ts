import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { PasswordPageComponent } from './containers/password-page/password-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: PasswordPageComponent
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class PasswordRoutingModule {}
