import { NgModule } from '@angular/core';

import { AuthGuard } from '@bookapp/angular/shared';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { BuyBooksPageComponent } from './containers/buy-books-page/buy-books-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: BuyBooksPageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class BuyBooksRoutingModule {}
