import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BestBooksBase } from '@bookapp/angular/base';
import { BestBooksService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-best-books-page',
  templateUrl: './best-books-page.component.html',
  styleUrls: ['./best-books-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BestBooksService],
})
export class BestBooksPageComponent extends BestBooksBase {
  constructor(booksService: BestBooksService) {
    super(booksService);
  }
}
