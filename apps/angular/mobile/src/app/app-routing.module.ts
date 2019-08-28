import { NgModule } from '@angular/core';

import { AuthPageComponent } from '@bookapp/angular/mobile/auth';
import { MainLayoutComponent } from '@bookapp/angular/mobile/main-layout';
import { AuthGuard } from '@bookapp/angular/shared';

import { NativeScriptRouterModule } from 'nativescript-angular/router';

@NgModule({
  imports: [
    NativeScriptRouterModule.forRoot([
      {
        path: 'auth',
        component: AuthPageComponent
      },
      {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
