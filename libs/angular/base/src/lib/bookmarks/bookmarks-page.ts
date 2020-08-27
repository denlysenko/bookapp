import { ActivatedRoute } from '@angular/router';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { BookmarksService, BooksService } from '@bookapp/angular/data-access';
import { ApiResponse, Book, Bookmark, BOOKMARKS_QUERY } from '@bookapp/shared';

import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';

export abstract class BookmarksPageBase {
  hasMoreItems = false;

  readonly type: string = this.route.snapshot.data.type;
  readonly source$ = this.bookmarksService
    .watchBookmarksByType(this.type)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly books$: Observable<Book[]> = this.source$.pipe(
    filter(({ data }) => !!data.bookmarks),
    tap(({ data }) => {
      const { rows, count } = data.bookmarks;
      this.hasMoreItems = rows.length !== count;
    }),
    map(({ data }) => data.bookmarks.rows.map((bookmark) => bookmark.book))
  );

  readonly loading$: Observable<boolean> = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading),
    tap((loading) => {
      this.pending = loading;
    })
  );

  readonly title$: Observable<string> = this.route.data.pipe(map((data) => data.title));

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
      this.bookmarksService.fetchMoreBookmarksByType(this.skip);
    }
  }

  rate(event: { bookId: string; rate: number }) {
    const variables = {
      type: this.type,
      skip: this.skip,
      first: DEFAULT_LIMIT,
    };

    this.booksService
      .rateBook(event, (store, { data: { rateBook } }) => {
        const data: { bookmarks: ApiResponse<Bookmark> } = store.readQuery({
          query: BOOKMARKS_QUERY,
          variables,
        });

        const updatedBookmark = data.bookmarks.rows.find(({ book }) => book._id === event.bookId);
        updatedBookmark.book.rating = rateBook.rating;
        updatedBookmark.book.total_rates = rateBook.total_rates;
        updatedBookmark.book.total_rating = rateBook.total_rating;

        store.writeQuery({
          query: BOOKMARKS_QUERY,
          variables,
          data,
        });
      })
      .subscribe();
  }
}
