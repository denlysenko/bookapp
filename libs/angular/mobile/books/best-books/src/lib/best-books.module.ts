import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BooksListModule } from '@bookapp/angular/ui-mobile';

import { NativeScriptCommonModule } from '@nativescript/angular';

import { BestBooksRoutingModule } from './best-books-routing.module';
import { BestBooksPageComponent } from './containers/best-books-page/best-books-page.component';

@NgModule({
  imports: [CommonModule, NativeScriptCommonModule, BestBooksRoutingModule, BooksListModule],
  declarations: [BestBooksPageComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BestBooksModule {}
