import { NgModule } from '@angular/core';

import { AuthPageComponent } from '@bookapp/angular/mobile/auth';

import { NativeScriptRouterModule } from 'nativescript-angular/router';

@NgModule({
  imports: [
    NativeScriptRouterModule.forRoot(
      [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'auth'
        },
        {
          path: 'auth',
          component: AuthPageComponent
        }
      ],
      { initialNavigation: 'enabled' }
    )
  ],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
