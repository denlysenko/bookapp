import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BookSearchModule, BooksListModule } from '@bookapp/angular/ui-mobile';

import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { BuyBooksRoutingModule } from './buy-books-routing.module';
import { BuyBooksPageComponent } from './containers/buy-books-page/buy-books-page.component';

@NgModule({
  imports: [
    NativeScriptCommonModule,
    CommonModule,
    BuyBooksRoutingModule,
    BookSearchModule,
    BooksListModule
  ],
  declarations: [BuyBooksPageComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BuyBooksModule {}
