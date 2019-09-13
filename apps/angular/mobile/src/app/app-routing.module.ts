import { NgModule } from '@angular/core';

import { AuthPageComponent } from '@bookapp/angular/mobile/auth';
import { MainLayoutComponent } from '@bookapp/angular/mobile/main-layout';
import { AuthGuard } from '@bookapp/angular/shared';

import { NativeScriptRouterModule } from 'nativescript-angular/router';

@NgModule({
  imports: [
    NativeScriptRouterModule.forRoot(
      [
        {
          path: 'auth',
          component: AuthPageComponent
        },
        {
          path: '',
          component: MainLayoutComponent,
          canActivate: [AuthGuard],
          children: [
            {
              path: 'password',
              loadChildren: () =>
                import('@bookapp/angular/mobile/password').then(
                  m => m.PasswordModule
                ),
              canLoad: [AuthGuard]
            },
            {
              path: 'profile',
              loadChildren: () =>
                import('@bookapp/angular/mobile/profile').then(
                  m => m.ProfileModule
                ),
              canLoad: [AuthGuard]
            }
          ]
        }
      ],
      {
        scrollPositionRestoration: 'enabled'
      }
    )
  ],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
