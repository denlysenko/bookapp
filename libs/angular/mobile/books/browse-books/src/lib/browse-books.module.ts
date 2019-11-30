import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { BookSearchModule, BooksListModule } from '@bookapp/angular/ui-mobile';

import { BrowseBooksPageComponent } from './containers/browse-books-page/browse-books-page.component';

@NgModule({
  imports: [NativeScriptCommonModule, CommonModule, BookSearchModule, BooksListModule],
  declarations: [BrowseBooksPageComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BrowseBooksModule {}
