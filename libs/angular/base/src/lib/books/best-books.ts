import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { BooksService } from '@bookapp/angular/data-access';
import { ApiResponse, BEST_BOOKS_QUERY, Book } from '@bookapp/shared';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

export abstract class BestBooksBase {
  booksQueryRef = this.booksService.getBestBooks();

  books$: Observable<Book[]> = this.booksQueryRef.valueChanges.pipe(
    tap(({ data: { bestBooks: { rows, count } } }) => {
      if (rows.length === count) {
        this.hasMoreItems.next(false);
      }
    }),
    map(({ data }) => data.bestBooks.rows)
  );

  loading$: Observable<boolean> = this.booksQueryRef.valueChanges.pipe(
    pluck('loading'),
    tap((loading: boolean) => {
      this.pending = loading;
    })
  );

  constructor(private readonly booksService: BooksService) {}

  private hasMoreItems = new BehaviorSubject<boolean>(true);
  private skip = 0;
  private pending = false;

  get hasMoreItems$() {
    return this.hasMoreItems.asObservable();
  }

  loadMore() {
    if (this.pending) {
      return;
    }

    if (this.hasMoreItems.getValue()) {
      this.skip += DEFAULT_LIMIT;

      this.booksQueryRef.fetchMore({
        variables: {
          skip: this.skip
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          const { rows, count } = fetchMoreResult.bestBooks;

          return {
            bestBooks: {
              count,
              rows: [...previousResult.bestBooks.rows, ...rows],
              __typename: 'BestBookResponse'
            }
          };
        }
      });
    }
  }

  rate(event: { bookId: string; rate: number }) {
    const query = BEST_BOOKS_QUERY;
    const variables = {
      skip: this.skip,
      first: DEFAULT_LIMIT
    };

    this.booksService
      .rateBook(event, (store, { data: { rateBook } }) => {
        const data: { bestBooks: ApiResponse<Book> } = store.readQuery({
          query,
          variables
        });

        if (rateBook.rating < 5) {
          const updatedBookIndex = data.bestBooks.rows.findIndex(({ _id }) => _id === event.bookId);
          if (updatedBookIndex > -1) {
            data.bestBooks.rows.splice(updatedBookIndex, 1);
          }
        } else {
          const updatedBook = data.bestBooks.rows.find(({ _id }) => _id === event.bookId);
          updatedBook.rating = rateBook.rating;
          updatedBook.total_rates = rateBook.total_rates;
          updatedBook.total_rating = rateBook.total_rating;
        }

        store.writeQuery({
          query,
          variables,
          data
        });
      })
      .subscribe();
  }
}
