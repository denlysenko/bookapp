import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReadBookResolver } from '@bookapp/angular/data-access';

import { ReadBookPageComponent } from './containers/read-book-page/read-book-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ReadBookPageComponent,
        resolve: {
          reading: ReadBookResolver,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ReadBookRoutingModule {}
