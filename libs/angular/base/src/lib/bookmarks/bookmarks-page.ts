import { ActivatedRoute } from '@angular/router';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { BookmarksService } from '@bookapp/angular/data-access';
import { Book, RateBookEvent } from '@bookapp/shared';

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
      this.hasMoreItems = rows.length < count;
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

  rate(event: RateBookEvent) {
    this.bookmarksService.rateBook(event).subscribe();
  }
}
