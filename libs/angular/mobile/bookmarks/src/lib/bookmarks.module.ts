import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BooksListModule } from '@bookapp/angular/ui-mobile';

import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { BookmarksRoutingModule } from './bookmarks-routing.module';
import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';

@NgModule({
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    BookmarksRoutingModule,
    BooksListModule
  ],
  declarations: [BookmarksPageComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BookmarksModule {}
