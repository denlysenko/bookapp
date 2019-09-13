import { NgModule } from '@angular/core';

import { AuthGuard } from '@bookapp/angular/shared';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { ProfilePageComponent } from './containers/profile-page/profile-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class ProfileRoutingModule {}
