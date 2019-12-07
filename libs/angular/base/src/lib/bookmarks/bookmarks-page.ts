import { ActivatedRoute } from '@angular/router';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { BookmarksService, BooksService } from '@bookapp/angular/data-access';
import { ApiResponse, Book, Bookmark, BOOKMARKS_QUERY } from '@bookapp/shared';

import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

export abstract class BookmarksPageBase {
  readonly type: string = this.route.snapshot.data.type;
  readonly bookmarksQueryRef = this.bookmarksService.getBookmarksByType(this.type);

  hasMoreItems = false;

  books$: Observable<Book[]> = this.bookmarksQueryRef.valueChanges.pipe(
    tap(({ data: { bookmarks: { rows, count } } }) => {
      this.hasMoreItems = rows.length !== count;
    }),
    map(({ data }) => data.bookmarks.rows.map(bookmark => bookmark.book))
  );

  loading$: Observable<boolean> = this.bookmarksQueryRef.valueChanges.pipe(
    pluck('loading'),
    tap(loading => {
      this.pending = loading;
    })
  );

  title$: Observable<string> = this.route.data.pipe(pluck('title'));

  private skip = 0;
  private pending = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly booksService: BooksService,
    private readonly bookmarksService: BookmarksService
  ) {}

  loadMore() {
    if (this.pending) {
      return;
    }

    if (this.hasMoreItems) {
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

        const updatedBookmark = data.bookmarks.rows.find(({ book }) => book._id === event.bookId);
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
