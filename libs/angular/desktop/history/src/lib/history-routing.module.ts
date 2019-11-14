import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HistoryPageComponent } from './containers/history-page/history-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HistoryPageComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class HistoryRoutingModule {}
