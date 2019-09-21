import { Component } from '@angular/core';

import { BooksPageBase } from '@bookapp/angular/base';
import { StoreService } from '@bookapp/angular/core';
import { BooksService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-buy-books-page',
  templateUrl: './buy-books-page.component.html',
  styleUrls: ['./buy-books-page.component.scss']
})
export class BuyBooksPageComponent extends BooksPageBase {
  constructor(storeService: StoreService, booksService: BooksService) {
    super(storeService, booksService, true);
  }
}
