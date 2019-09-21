import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@bookapp/angular/shared';

import { BuyBooksPageComponent } from './containers/buy-books-page/buy-books-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BuyBooksPageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class BuyBooksRoutingModule {}
