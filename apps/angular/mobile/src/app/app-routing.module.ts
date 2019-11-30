import { NgModule } from '@angular/core';

import { AuthPageComponent } from '@bookapp/angular/mobile/auth';
import { BrowseBooksPageComponent } from '@bookapp/angular/mobile/books/browse-books';
import { MainLayoutComponent } from '@bookapp/angular/mobile/main-layout';
import { AuthGuard } from '@bookapp/angular/shared';
import { BOOKMARKS } from '@bookapp/shared';

import { NativeScriptRouterModule } from 'nativescript-angular/router';

// tslint:disable: no-duplicate-string
@NgModule({
  imports: [
    NativeScriptRouterModule.forRoot(
      [
        {
          path: 'auth',
          component: AuthPageComponent
        },
        {
          path: 'books/browse/:author/:slug',
          loadChildren: () =>
            import('@bookapp/angular/mobile/books/view-book').then(
              m => m.ViewBookModule
            ),
          canLoad: [AuthGuard],
          canActivate: [AuthGuard]
        },
        {
          path: 'books/buy/:author/:slug',
          loadChildren: () =>
            import('@bookapp/angular/mobile/books/view-book').then(
              m => m.ViewBookModule
            ),
          canLoad: [AuthGuard],
          canActivate: [AuthGuard]
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
              canLoad: [AuthGuard],
              canActivate: [AuthGuard]
            },
            {
              path: 'bookmarks/favorites',
              loadChildren: () =>
                import('@bookapp/angular/mobile/bookmarks').then(
                  m => m.BookmarksModule
                ),
              canLoad: [AuthGuard],
              canActivate: [AuthGuard],
              data: {
                title: 'Favorite Books',
                type: BOOKMARKS.FAVORITES
              }
            },
            {
              path: 'bookmarks/mustread',
              loadChildren: () =>
                import('@bookapp/angular/mobile/bookmarks').then(
                  m => m.BookmarksModule
                ),
              canLoad: [AuthGuard],
              canActivate: [AuthGuard],
              data: {
                title: 'Must Read Titles',
                type: BOOKMARKS.MUSTREAD
              }
            },
            {
              path: 'bookmarks/wishlist',
              loadChildren: () =>
                import('@bookapp/angular/mobile/bookmarks').then(
                  m => m.BookmarksModule
                ),
              canLoad: [AuthGuard],
              canActivate: [AuthGuard],
              data: {
                title: 'Wishlist',
                type: BOOKMARKS.WISHLIST
              }
            },
            {
              path: 'password',
              loadChildren: () =>
                import('@bookapp/angular/mobile/password').then(
                  m => m.PasswordModule
                ),
              canLoad: [AuthGuard],
              canActivate: [AuthGuard]
            },
            {
              path: 'profile',
              loadChildren: () =>
                import('@bookapp/angular/mobile/profile').then(
                  m => m.ProfileModule
                ),
              canLoad: [AuthGuard],
              canActivate: [AuthGuard]
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
