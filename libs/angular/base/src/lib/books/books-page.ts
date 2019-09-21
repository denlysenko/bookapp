import { DEFAULT_LIMIT, StoreService } from '@bookapp/angular/core';
import { BooksService, DEFAULT_SORT_VALUE } from '@bookapp/angular/data-access';
import {
  ApiResponse,
  Book,
  BooksFilter,
  FREE_BOOKS_QUERY,
  PAID_BOOKS_QUERY
} from '@bookapp/shared';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

const FILTER_KEYS = {
  BROWSE_BOOKS: 'BROWSE_BOOKS',
  BUY_BOOKS: 'BUY_BOOKS'
};

export abstract class BooksPageBase extends BaseComponent {
  filter = new BehaviorSubject<BooksFilter>(
    this.storeService.get(
      FILTER_KEYS[this.paid ? 'BUY_BOOKS' : 'BROWSE_BOOKS']
    ) || {
      searchQuery: '',
      sortValue: DEFAULT_SORT_VALUE
    }
  );

  filterInput = { field: 'title', search: this.filter.getValue().searchQuery };

  booksQueryRef = this.booksService.getBooks(this.paid, this.filterInput);

  books$: Observable<Book[]> = this.booksQueryRef.valueChanges.pipe(
    tap(({ data: { books: { rows, count } } }) => {
      if (rows.length === count) {
        this.hasMoreItems = false;
      }
    }),
    map(({ data }) => data.books.rows)
  );

  loading$: Observable<boolean> = this.booksQueryRef.valueChanges.pipe(
    pluck('loading'),
    tap(loading => {
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
  private hasMoreItems = true;
  private pending = false;

  get filter$(): Observable<BooksFilter> {
    return this.filter.asObservable();
  }

  sort(sortValue: BooksFilter['sortValue']) {
    this.skip = 0;

    this.filter.next({
      ...this.filter.getValue(),
      sortValue
    });

    this.updateFilterInStore();

    this.booksQueryRef.refetch({
      skip: this.skip,
      orderBy: sortValue
    });
  }

  search(searchQuery: string) {
    this.skip = 0;

    this.filter.next({
      ...this.filter.getValue(),
      searchQuery
    });

    this.updateFilterInStore();

    this.filterInput = {
      ...this.filterInput,
      search: searchQuery
    };

    this.booksQueryRef.refetch({
      filter: this.filterInput,
      skip: this.skip
    });
  }

  loadMore() {
    if (this.pending) {
      return;
    }

    if (this.hasMoreItems) {
      this.skip += DEFAULT_LIMIT;

      this.booksQueryRef.fetchMore({
        variables: {
          skip: this.skip
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          const { rows, count } = fetchMoreResult.books;

          return {
            books: {
              count,
              rows: [...previousResult.books.rows, ...rows],
              __typename: 'BookResponse'
            }
          };
        }
      });
    }
  }

  rate(event: { bookId: string; rate: number }) {
    const query = this.paid ? PAID_BOOKS_QUERY : FREE_BOOKS_QUERY;
    const variables = {
      paid: this.paid,
      filter: this.filterInput,
      skip: this.skip,
      first: DEFAULT_LIMIT,
      orderBy: this.filter.getValue().sortValue
    };

    this.booksService
      .rateBook(event, (store, { data: { rateBook } }) => {
        const data: { books: ApiResponse<Book> } = store.readQuery({
          query,
          variables
        });

        const updatedBook = data.books.rows.find(
          ({ _id }) => _id === event.bookId
        );
        updatedBook.rating = rateBook.rating;
        updatedBook.total_rates = rateBook.total_rates;
        updatedBook.total_rating = rateBook.total_rating;

        store.writeQuery({
          query,
          variables,
          data
        });
      })
      .subscribe();
  }

  private updateFilterInStore() {
    this.storeService.set(
      FILTER_KEYS[this.paid ? 'BUY_BOOKS' : 'BROWSE_BOOKS'],
      this.filter.getValue()
    );
  }
}
