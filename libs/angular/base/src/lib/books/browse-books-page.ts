import { inject, signal } from '@angular/core';

import { StoreService } from '@bookapp/angular/core';
import { BooksService, DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { Book, BooksFilter, RateBookEvent } from '@bookapp/shared/interfaces';

import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

export abstract class BrowseBooksPageBase extends BaseComponent {
  readonly #storeService = inject(StoreService);
  readonly #booksService = inject(BooksService);

  readonly filter = signal<BooksFilter>(
    this.#storeService.get('BROWSE_BOOKS') || {
      searchQuery: '',
      sortValue: DEFAULT_SORT_VALUE,
    }
  );

  filterInput = { field: 'title', search: this.filter().searchQuery };

  readonly source$ = this.#booksService
    .watchBooks(false, this.filterInput, this.filter().sortValue)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly books$: Observable<Book[]> = this.source$.pipe(
    filter(({ data }) => !!data.books),
    tap(({ data }) => {
      const { rows, count } = data.books;
      this.hasMoreItems.set(rows.length !== count);
    }),
    map(({ data }) => data.books.rows)
  );

  readonly loading$: Observable<boolean> = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading),
    tap((loading) => {
      this.#pending = loading;
    })
  );

  #skip = 0;
  #pending = false;

  readonly hasMoreItems = signal(false);

  sort(sortValue: BooksFilter['sortValue']) {
    this.#skip = 0;
    this.filter.update((filter) => ({ ...filter, sortValue }));
    this.#updateFilterInStore();
    this.#booksService.refetch({
      skip: this.#skip,
      orderBy: sortValue,
    });
  }

  search(searchQuery: string) {
    this.#skip = 0;
    this.filter.update((filter) => ({ ...filter, searchQuery }));
    this.#updateFilterInStore();
    this.filterInput = {
      ...this.filterInput,
      search: searchQuery,
    };
    this.#booksService.refetch({
      filter: this.filterInput,
      skip: this.#skip,
    });
  }

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

  #updateFilterInStore() {
    this.#storeService.set('BROWSE_BOOKS', this.filter());
  }
}
