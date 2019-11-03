import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EditBookResolver } from '@bookapp/angular/data-access';
import { CanDeactivateGuard } from '@bookapp/angular/shared';
import { ROLES } from '@bookapp/shared';

import { AddBookPageComponent } from './containers/add-book-page/add-book-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AddBookPageComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          roles: [ROLES.ADMIN]
        }
      },
      {
        path: ':author/:slug',
        component: AddBookPageComponent,
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
