import { Routes } from '@angular/router';

import { editBookResolver } from '@bookapp/angular/data-access';
import { canDeactivateGuard } from '@bookapp/angular/shared';
import { ROLES } from '@bookapp/shared/enums';

import { AddBookPageComponent } from './containers/add-book-page/add-book-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AddBookPageComponent,
    canDeactivate: [canDeactivateGuard],
    data: {
      roles: [ROLES.ADMIN],
    },
  },
  {
    path: ':author/:slug',
    component: AddBookPageComponent,
    canDeactivate: [canDeactivateGuard],
    resolve: {
      book: editBookResolver,
    },
    data: {
      roles: [ROLES.ADMIN],
    },
  },
];
