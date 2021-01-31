import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';

import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';

import { BookListItemComponent } from './book-list-item.component';
import { BooksListComponent } from './books-list.component';

@NgModule({
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NativeScriptUIListViewModule,
  ],
  declarations: [BooksListComponent, BookListItemComponent],
  exports: [BooksListComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BooksListModule {}
