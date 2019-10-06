import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@bookapp/angular/shared';

import { ViewBookPageComponent } from './containers/view-book-page/view-book-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ViewBookPageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ViewBookRoutingModule {}
