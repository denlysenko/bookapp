import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BestBooksPageComponent } from './containers/best-books-page/best-books-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BestBooksPageComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class BestBooksRoutingModule {}
