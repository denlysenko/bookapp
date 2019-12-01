import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { HistoryPageComponent } from './containers/history-page/history-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: HistoryPageComponent
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class HistoryRoutingModule {}
