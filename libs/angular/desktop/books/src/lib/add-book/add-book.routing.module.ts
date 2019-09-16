import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EditBookResolver } from '@bookapp/angular/data-access';
import {
  AuthGuard,
  CanDeactivateGuard,
  RolesGuard
} from '@bookapp/angular/shared';
import { ROLES } from '@bookapp/shared';

import { AddBookPageComponent } from './containers/add-book-page/add-book-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AddBookPageComponent,
        canActivate: [AuthGuard, RolesGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
          roles: [ROLES.ADMIN]
        }
      },
      {
        path: 'edit/:author/:slug',
        component: AddBookPageComponent,
        canActivate: [AuthGuard, RolesGuard],
        canDeactivate: [CanDeactivateGuard],
        resolve: {
          book: EditBookResolver
        },
        data: {
          roles: [ROLES.ADMIN]
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class AddBookRoutingModule {}
