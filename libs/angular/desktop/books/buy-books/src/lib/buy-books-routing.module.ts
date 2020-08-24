import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BuyBooksPageComponent } from './containers/buy-books-page/buy-books-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BuyBooksPageComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class BuyBooksRoutingModule {}
