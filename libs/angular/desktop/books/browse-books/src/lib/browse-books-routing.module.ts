import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@bookapp/angular/shared';

import { BrowseBooksPageComponent } from './containers/browse-books-page/browse-books-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BrowseBooksPageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class BrowseBooksRoutingModule {}
