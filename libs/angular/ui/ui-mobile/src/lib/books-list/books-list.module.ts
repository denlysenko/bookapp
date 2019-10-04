import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { registerElement } from 'nativescript-angular/element-registry';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { NgShadowModule } from 'nativescript-ngx-shadow';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';

import { BookListItemComponent } from './book-list-item.component';
import { BooksListComponent } from './books-list.component';

registerElement(
  'StarRating',
  () => require('nativescript-star-ratings').StarRating
);

@NgModule({
  imports: [
    CommonModule,
    NativeScriptCommonModule,
    NativeScriptRouterModule,
    NgShadowModule,
    NativeScriptUIListViewModule
  ],
  declarations: [BooksListComponent, BookListItemComponent],
  exports: [BooksListComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BooksListModule {}
