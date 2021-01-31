import { BestBooksService } from '@bookapp/angular/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { Book, RateBookEvent } from '@bookapp/shared/interfaces';

import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

export abstract class BestBooksBase extends BaseComponent {
  hasMoreItems = false;

  readonly source$ = this.booksService
    .watchBooks()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  books$: Observable<Book[]> = this.source$.pipe(
    filter(({ data }) => !!data.bestBooks),
    tap(({ data }) => {
      const { rows, count } = data.bestBooks;
      this.hasMoreItems = rows.length !== count;
    }),
    map(({ data }) => data.bestBooks.rows)
  );

  loading$: Observable<boolean> = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading),
    tap((loading: boolean) => {
      this.pending = loading;
    })
  );

  constructor(private readonly booksService: BestBooksService) {
    super();
  }

  private skip = 0;
  private pending = false;

  loadMore() {
    if (this.pending) {
      return;
    }

    if (this.hasMoreItems) {
      this.skip += DEFAULT_LIMIT;
      this.booksService.loadMore(this.skip);
    }
  }

  rate(event: RateBookEvent) {
    this.booksService.rateBook(event).subscribe();
  }
}
