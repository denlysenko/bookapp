import { Component } from '@angular/core';

import { BestBooksBase } from '@bookapp/angular/base';
import { BooksService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-best-books-page',
  templateUrl: './best-books-page.component.html',
  styleUrls: ['./best-books-page.component.scss']
})
export class BestBooksPageComponent extends BestBooksBase {
  constructor(booksService: BooksService) {
    super(booksService);
  }
}
