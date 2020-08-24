import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ViewBookPageComponent } from './containers/view-book-page/view-book-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ViewBookPageComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ViewBookRoutingModule {}
