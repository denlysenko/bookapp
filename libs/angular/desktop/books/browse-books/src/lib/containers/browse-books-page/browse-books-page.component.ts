import { Component } from '@angular/core';

import { BooksPageBase } from '@bookapp/angular/base';
import { StoreService } from '@bookapp/angular/core';
import { BooksService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-browse-books-page',
  templateUrl: './browse-books-page.component.html',
  styleUrls: ['./browse-books-page.component.scss']
})
export class BrowseBooksPageComponent extends BooksPageBase {
  constructor(storeService: StoreService, booksService: BooksService) {
    super(storeService, booksService, false);
  }
}
