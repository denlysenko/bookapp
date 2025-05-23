import { inject, signal } from '@angular/core';

import { BestBooksService } from '@bookapp/angular/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { Book, RateBookEvent } from '@bookapp/shared/interfaces';

import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

export abstract class BestBooksBase extends BaseComponent {
  readonly #booksService = inject(BestBooksService);

  readonly source$ = this.#booksService
    .watchBooks()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly books$: Observable<Book[]> = this.source$.pipe(
    filter(({ data }) => !!data.bestBooks),
    tap(({ data }) => {
      const { rows, count } = data.bestBooks;
      this.hasMoreItems.set(rows.length !== count);
    }),
    map(({ data }) => data.bestBooks.rows)
  );

  readonly loading$: Observable<boolean> = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading),
    tap((loading: boolean) => {
      this.#pending = loading;
    })
  );

  readonly hasMoreItems = signal(false);

  #skip = 0;
  #pending = false;

  loadMore() {
    if (this.#pending) {
      return;
    }

    if (this.hasMoreItems()) {
      this.#skip += DEFAULT_LIMIT;
      this.#booksService.loadMore(this.#skip);
    }
  }

  rate(event: RateBookEvent) {
    this.#booksService.rateBook(event).subscribe();
  }
}
