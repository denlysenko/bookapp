import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
  BooksFilterModule,
  BooksListModule,
  PreloaderModule
} from '@bookapp/angular/ui';

import { BuyBooksRoutingModule } from './buy-books-routing.module';
import { BuyBooksPageComponent } from './containers/buy-books-page/buy-books-page.component';

@NgModule({
  imports: [
    CommonModule,
    BuyBooksRoutingModule,
    MatToolbarModule,
    PreloaderModule,
    BooksFilterModule,
    BooksListModule
  ],
  declarations: [BuyBooksPageComponent]
})
export class BuyBooksModule {}
