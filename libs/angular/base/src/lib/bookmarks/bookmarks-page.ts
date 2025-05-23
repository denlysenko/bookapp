import { inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookmarksService } from '@bookapp/angular/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { Book, RateBookEvent } from '@bookapp/shared/interfaces';

import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

export abstract class BookmarksPageBase extends BaseComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #bookmarksService = inject(BookmarksService);

  readonly hasMoreItems = signal(false);

  readonly type: string = this.#activatedRoute.snapshot.data.type;
  readonly source$ = this.#bookmarksService
    .watchBookmarksByType(this.type)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly books$: Observable<Book[]> = this.source$.pipe(
    filter(({ data }) => !!data.bookmarks),
    tap(({ data }) => {
      const { rows, count } = data.bookmarks;
      this.hasMoreItems.set(rows.length < count);
    }),
    map(({ data }) => data.bookmarks.rows.map((bookmark) => bookmark.book))
  );

  readonly loading$: Observable<boolean> = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading),
    tap((loading) => {
      this.#pending = loading;
    })
  );

  readonly title$: Observable<string> = this.#activatedRoute.data.pipe(map((data) => data.title));

  #skip = 0;
  #pending = false;

  loadMore() {
    if (this.#pending) {
      return;
    }

    if (this.hasMoreItems()) {
      this.#skip += DEFAULT_LIMIT;
      this.#bookmarksService.fetchMoreBookmarksByType(this.#skip);
    }
  }

  rate(event: RateBookEvent) {
    this.#bookmarksService.rateBook(event).subscribe();
  }
}
