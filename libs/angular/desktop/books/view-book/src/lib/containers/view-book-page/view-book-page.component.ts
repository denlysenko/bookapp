import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { PaymentRequestPlatformService } from '@bookapp/angular/core';
import { AuthService, BookmarksService, BookService } from '@bookapp/angular/data-access';
import { Book } from '@bookapp/shared/interfaces';

import { map } from 'rxjs/operators';

@Component({
  selector: 'bookapp-view-book-page',
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService, BookService],
})
export class ViewBookPageComponent extends ViewBookPageBase {
  user$ = this.authService.fetchMe().pipe(map(({ data }) => data.me));

  constructor(
    route: ActivatedRoute,
    bookService: BookService,
    bookmarksService: BookmarksService,
    private readonly authService: AuthService,
    private readonly paymentRequestService: PaymentRequestPlatformService
  ) {
    super(route, bookService, bookmarksService);
  }

  async pay(book: Book) {
    try {
      const response = await this.paymentRequestService.request({
        total: {
          amount: {
            currency: 'USD',
            value: book.price.toString(),
          },
          label: `${book.title} by ${book.author}`,
        },
      });
      response.complete();
    } catch {}
  }
}
