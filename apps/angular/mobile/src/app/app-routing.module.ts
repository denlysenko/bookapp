import { NgModule } from '@angular/core';

import { AuthPageComponent } from '@bookapp/angular/mobile/auth';
import { BrowseBooksPageComponent } from '@bookapp/angular/mobile/books/browse-books';
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
              path: '',
              pathMatch: 'full',
              redirectTo: '/books/browse'
            },
            {
              path: 'books/browse',
              component: BrowseBooksPageComponent,
              canActivate: [AuthGuard]
            },
            {
              path: 'books/buy',
              loadChildren: () =>
                import('@bookapp/angular/mobile/books/buy-books').then(
                  m => m.BuyBooksModule
                ),
              canLoad: [AuthGuard]
            },
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
