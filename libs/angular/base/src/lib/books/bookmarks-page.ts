import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { BookmarksService, BooksService } from '@bookapp/angular/data-access';
import { ApiResponse, Bookmark, BOOKMARKS_QUERY } from '@bookapp/shared';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

export abstract class BookmarksPageBase {
  bookmarksQueryRef = this.bookmarksService.getBookmarksByType(this.type);

  bookmarks$: Observable<Bookmark[]> = this.bookmarksQueryRef.valueChanges.pipe(
    tap(({ data: { bookmarks: { rows, count } } }) => {
      if (rows.length === count) {
        this.hasMoreItems.next(false);
      }
    }),
    map(({ data }) => data.bookmarks.rows)
  );

  loading$: Observable<boolean> = this.bookmarksQueryRef.valueChanges.pipe(
    pluck('loading'),
    tap(loading => {
      this.pending = loading;
    })
  );

  constructor(
    private readonly booksService: BooksService,
    private readonly bookmarksService: BookmarksService,
    private readonly type: string
  ) {}

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

      this.bookmarksQueryRef.fetchMore({
        variables: {
          skip: this.skip
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          const { rows, count } = fetchMoreResult.bookmarks;

          return {
            bookmarks: {
              count,
              rows: [...previousResult.bookmarks.rows, ...rows],
              __typename: 'BookmarksResponse'
            }
          };
        }
      });
    }
  }

  rate(event: { bookId: string; rate: number }) {
    const variables = {
      type: this.type,
      skip: this.skip,
      first: DEFAULT_LIMIT
    };

    this.booksService
      .rateBook(event, (store, { data: { rateBook } }) => {
        const data: { bookmarks: ApiResponse<Bookmark> } = store.readQuery({
          query: BOOKMARKS_QUERY,
          variables
        });

        const updatedBookmark = data.bookmarks.rows.find(
          ({ book }) => book._id === event.bookId
        );
        updatedBookmark.book.rating = rateBook.rating;
        updatedBookmark.book.total_rates = rateBook.total_rates;
        updatedBookmark.book.total_rating = rateBook.total_rating;

        store.writeQuery({
          query: BOOKMARKS_QUERY,
          variables,
          data
        });
      })
      .subscribe();
  }
}
