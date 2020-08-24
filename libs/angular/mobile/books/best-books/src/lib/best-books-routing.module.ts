import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { BestBooksPageComponent } from './containers/best-books-page/best-books-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: BestBooksPageComponent,
      },
    ]),
  ],
  exports: [NativeScriptRouterModule],
})
export class BestBooksRoutingModule {}
