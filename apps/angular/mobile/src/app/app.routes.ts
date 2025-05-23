import { Routes } from '@angular/router';

import { AuthPageComponent } from '@bookapp/angular/mobile/auth';
import { BrowseBooksPageComponent } from '@bookapp/angular/mobile/books/browse-books';
import { MainLayoutComponent } from '@bookapp/angular/mobile/main-layout';
import { authGuard } from '@bookapp/angular/shared';
import { BOOKMARKS } from '@bookapp/shared/enums';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
  },
  {
    path: 'books/browse/:author/:slug',
    loadChildren: () => import('@bookapp/angular/mobile/books/view-book').then((m) => m.routes),
    canMatch: [authGuard],
  },
  {
    path: 'books/buy/:author/:slug',
    loadChildren: () => import('@bookapp/angular/mobile/books/view-book').then((m) => m.routes),
    canMatch: [authGuard],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/books/browse',
      },
      {
        path: 'books/browse',
        component: BrowseBooksPageComponent,
      },
      {
        path: 'books/buy',
        loadChildren: () => import('@bookapp/angular/mobile/books/buy-books').then((m) => m.routes),
      },
      {
        path: 'books/best',
        loadChildren: () =>
          import('@bookapp/angular/mobile/books/best-books').then((m) => m.routes),
      },
      {
        path: 'books/read/:author/:slug',
        loadChildren: () => import('@bookapp/angular/mobile/books/read-book').then((m) => m.routes),
      },
      {
        path: 'books/read',
        loadChildren: () => import('@bookapp/angular/mobile/books/read-book').then((m) => m.routes),
      },
      {
        path: 'bookmarks/favorites',
        loadChildren: () => import('@bookapp/angular/mobile/bookmarks').then((m) => m.routes),
        data: {
          title: 'Favorite Books',
          type: BOOKMARKS.FAVORITES,
        },
      },
      {
        path: 'bookmarks/mustread',
        loadChildren: () => import('@bookapp/angular/mobile/bookmarks').then((m) => m.routes),
        data: {
          title: 'Must Read Titles',
          type: BOOKMARKS.MUSTREAD,
        },
      },
      {
        path: 'bookmarks/wishlist',
        loadChildren: () => import('@bookapp/angular/mobile/bookmarks').then((m) => m.routes),
        data: {
          title: 'Wishlist',
          type: BOOKMARKS.WISHLIST,
        },
      },
      {
        path: 'history',
        loadChildren: () => import('@bookapp/angular/mobile/history').then((m) => m.routes),
      },
      {
        path: 'password',
        loadChildren: () => import('@bookapp/angular/mobile/password').then((m) => m.routes),
      },
      {
        path: 'profile',
        loadChildren: () => import('@bookapp/angular/mobile/profile').then((m) => m.routes),
      },
    ],
  },
];
