import { NgModule } from '@angular/core';

import { ReadBookResolver } from '@bookapp/angular/data-access';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { ReadBookPageComponent } from './containers/read-book-page/read-book-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: ReadBookPageComponent,
        resolve: {
          reading: ReadBookResolver
        }
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class ReadBookRoutingModule {}
