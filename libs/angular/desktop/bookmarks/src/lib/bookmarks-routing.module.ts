import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BookmarksPageComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class BookmarksRoutingModule {}
