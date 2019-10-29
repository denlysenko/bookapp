import { NgModule } from '@angular/core';

import { AuthGuard } from '@bookapp/angular/shared';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { ViewBookPageComponent } from './containers/view-book-page/view-book-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: ViewBookPageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class ViewBookRoutingModule {}
