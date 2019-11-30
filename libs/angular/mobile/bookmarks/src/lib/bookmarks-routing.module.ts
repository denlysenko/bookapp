import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular';

import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';

@NgModule({
  imports: [
    NativeScriptRouterModule.forChild([
      {
        path: '',
        component: BookmarksPageComponent
      }
    ])
  ],
  exports: [NativeScriptRouterModule]
})
export class BookmarksRoutingModule {}
