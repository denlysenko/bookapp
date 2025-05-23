import { inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookmarksService, BookService } from '@bookapp/angular/data-access';
import { Book, BookmarkEvent, RateBookEvent } from '@bookapp/shared/interfaces';

import { Observable } from 'rxjs';
import { filter, finalize, map, shareReplay, startWith } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

export abstract class ViewBookPageBase extends BaseComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #bookService = inject(BookService);
  readonly #bookmarksService = inject(BookmarksService);

  readonly source$ = this.#bookService
    .watchBook(this.#activatedRoute.snapshot.paramMap.get('slug'))
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly book$: Observable<Book> = this.source$.pipe(map(({ data }) => data.book));

  readonly loading$ = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading)
  );

  readonly bookmarks$: Observable<string[]> = this.#bookmarksService
    .watchBookmarksByBook(this.#activatedRoute.snapshot.queryParamMap.get('bookId'))
    .pipe(
      filter(({ data }) => !!data.userBookmarksByBook),
      map(({ data }) => data.userBookmarksByBook),
      map((bookmarks) => bookmarks.map((bookmark) => bookmark.type))
    );

  readonly loading = signal(false);

  submitComment(bookId: string, text: string) {
    this.loading.set(true);

    this.#bookService
      .addComment(bookId, text)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe();
  }

  addToBookmarks(event: BookmarkEvent) {
    this.#bookmarksService.addToBookmarks(event).subscribe();
  }

  removeFromBookmarks(event: BookmarkEvent) {
    this.#bookmarksService.removeFromBookmarks(event).subscribe();
  }

  rate(event: RateBookEvent) {
    this.#bookService.rateBook(event).subscribe();
  }
}
