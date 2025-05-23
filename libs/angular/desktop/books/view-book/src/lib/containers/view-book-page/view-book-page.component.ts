import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { PaymentRequestPlatformService } from '@bookapp/angular/core';
import { AuthService, BookmarksService, BookService } from '@bookapp/angular/data-access';
import { Book } from '@bookapp/shared/interfaces';

import { map } from 'rxjs/operators';

import { BookCommentsComponent } from '../../components/book-comments/book-comments.component';
import { BookDetailsComponent } from '../../components/book-details/book-details.component';

@Component({
  imports: [
    AsyncPipe,
    MatToolbarModule,
    MatCardModule,
    BookDetailsComponent,
    BookCommentsComponent,
  ],
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookService, BookmarksService],
})
export class ViewBookPageComponent extends ViewBookPageBase {
  readonly #authService = inject(AuthService);
  readonly #paymentRequestService = inject(PaymentRequestPlatformService);

  readonly user$ = this.#authService.fetchMe().pipe(map(({ data }) => data.me));

  async pay(book: Book) {
    try {
      const response = await this.#paymentRequestService.request({
        total: {
          amount: {
            currency: 'USD',
            value: book.price.toString(),
          },
          label: `${book.title} by ${book.author}`,
        },
      });
      response.complete();
    } catch {
      //
    }
  }
}
