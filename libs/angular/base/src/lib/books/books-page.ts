import { DEFAULT_LIMIT, StoreService } from '@bookapp/angular/core';
import { BooksService, DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';
import { Book, BooksFilter, RateBookEvent } from '@bookapp/shared/interfaces';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

const FILTER_KEYS = {
  BROWSE_BOOKS: 'BROWSE_BOOKS',
  BUY_BOOKS: 'BUY_BOOKS',
};

export abstract class BooksPageBase extends BaseComponent {
  readonly filter = new BehaviorSubject<BooksFilter>(
    this.storeService.get(FILTER_KEYS[this.paid ? 'BUY_BOOKS' : 'BROWSE_BOOKS']) || {
      searchQuery: '',
      sortValue: DEFAULT_SORT_VALUE,
    }
  );

  filterInput = { field: 'title', search: this.filter.getValue().searchQuery };
  hasMoreItems = false;

  readonly source$ = this.booksService
    .watchBooks(this.paid, this.filterInput, this.filter.getValue().sortValue)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  books$: Observable<Book[]> = this.source$.pipe(
    filter(({ data }) => !!data.books),
    tap(({ data }) => {
      const { rows, count } = data.books;
      this.hasMoreItems = rows.length !== count;
    }),
    map(({ data }) => data.books.rows)
  );

  loading$: Observable<boolean> = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading),
    tap((loading) => {
      this.pending = loading;
    })
  );

  constructor(
    private readonly storeService: StoreService,
    private readonly booksService: BooksService,
    private readonly paid: boolean
  ) {
    super();
  }

  private skip = 0;
  private pending = false;

  get filter$(): Observable<BooksFilter> {
    return this.filter.asObservable();
  }

  sort(sortValue: BooksFilter['sortValue']) {
    this.skip = 0;

    this.filter.next({
      ...this.filter.getValue(),
      sortValue,
    });

    this.updateFilterInStore();

    this.booksService.refetch({
      skip: this.skip,
      orderBy: sortValue,
    });
  }

  search(searchQuery: string) {
    this.skip = 0;

    this.filter.next({
      ...this.filter.getValue(),
      searchQuery,
    });

    this.updateFilterInStore();

    this.filterInput = {
      ...this.filterInput,
      search: searchQuery,
    };

    this.booksService.refetch({
      filter: this.filterInput,
      skip: this.skip,
    });
  }

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

  private updateFilterInStore() {
    this.storeService.set(
      FILTER_KEYS[this.paid ? 'BUY_BOOKS' : 'BROWSE_BOOKS'],
      this.filter.getValue()
    );
  }
}
