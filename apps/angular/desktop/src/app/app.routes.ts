import { Routes } from '@angular/router';

import { AuthPageComponent } from '@bookapp/angular/desktop/auth';
import { BrowseBooksPageComponent } from '@bookapp/angular/desktop/books/browse-books';
import { MainLayoutComponent } from '@bookapp/angular/desktop/main-layout';
import { authGuard, rolesGuard } from '@bookapp/angular/shared';
import { BOOKMARKS, ROLES } from '@bookapp/shared/enums';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
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
        path: 'books/browse/:author/:slug',
        loadChildren: () =>
          import('@bookapp/angular/desktop/books/view-book').then((m) => m.routes),
      },
      {
        path: 'books/buy',
        loadChildren: () =>
          import('@bookapp/angular/desktop/books/buy-books').then((m) => m.routes),
      },
      {
        path: 'books/buy/:author/:slug',
        loadChildren: () =>
          import('@bookapp/angular/desktop/books/view-book').then((m) => m.routes),
      },
      {
        path: 'books/add',
        loadChildren: () => import('@bookapp/angular/desktop/books/add-book').then((m) => m.routes),
        canMatch: [rolesGuard],
        data: {
          roles: [ROLES.ADMIN],
        },
      },
      {
        path: 'books/best',
        loadChildren: () =>
          import('@bookapp/angular/desktop/books/best-books').then((m) => m.routes),
      },
      {
        path: 'books/read/:author/:slug',
        loadChildren: () =>
          import('@bookapp/angular/desktop/books/read-book').then((m) => m.routes),
      },
      {
        path: 'books/read',
        loadChildren: () =>
          import('@bookapp/angular/desktop/books/read-book').then((m) => m.routes),
      },
      {
        path: 'bookmarks/favorites',
        loadChildren: () => import('@bookapp/angular/desktop/bookmarks').then((m) => m.routes),
        data: {
          title: 'Favorite Books',
          type: BOOKMARKS.FAVORITES,
        },
      },
      {
        path: 'bookmarks/mustread',
        loadChildren: () => import('@bookapp/angular/desktop/bookmarks').then((m) => m.routes),
        data: {
          title: 'Must Read Titles',
          type: BOOKMARKS.MUSTREAD,
        },
      },
      {
        path: 'bookmarks/wishlist',
        loadChildren: () => import('@bookapp/angular/desktop/bookmarks').then((m) => m.routes),
        data: {
          title: 'Wishlist',
          type: BOOKMARKS.WISHLIST,
        },
      },
      {
        path: 'history',
        loadChildren: () => import('@bookapp/angular/desktop/history').then((m) => m.routes),
      },
      {
        path: 'password',
        loadChildren: () => import('@bookapp/angular/desktop/password').then((m) => m.routes),
      },
      {
        path: 'profile',
        loadChildren: () => import('@bookapp/angular/desktop/profile').then((m) => m.routes),
      },
    ],
  },
];
