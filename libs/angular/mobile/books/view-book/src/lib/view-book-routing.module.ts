import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { ViewBookPageComponent } from './containers/view-book-page/view-book-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: ViewBookPageComponent,
      },
    ]),
  ],
  exports: [NativeScriptRouterModule],
})
export class ViewBookRoutingModule {}
