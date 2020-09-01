import { ActivatedRoute } from '@angular/router';

import { BookmarksService, BookService } from '@bookapp/angular/data-access';
import { Book, BookmarkEvent, RateBookEvent } from '@bookapp/shared';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

export abstract class ViewBookPageBase {
  book$: Observable<Book> = this.bookService
    .watchBook(this.route.snapshot.paramMap.get('slug'))
    .pipe(map(({ data }) => data.book));

  bookmarks$: Observable<string[]> = this.bookmarksService
    .watchBookmarksByBook(this.route.snapshot.queryParamMap.get('bookId'))
    .pipe(
      filter(({ data }) => !!data.userBookmarksByBook),
      map(({ data }) => data.userBookmarksByBook),
      map((bookmarks) => bookmarks.map((bookmark) => bookmark.type))
    );

  private loading = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookService: BookService,
    private readonly bookmarksService: BookmarksService
  ) {}

  get loading$() {
    return this.loading.asObservable();
  }

  submitComment(bookId: string, text: string) {
    this.loading.next(true);

    this.bookService
      .addComment(bookId, text)
      .pipe(
        finalize(() => {
          this.loading.next(false);
        })
      )
      .subscribe();
  }

  addToBookmarks(event: BookmarkEvent) {
    this.bookmarksService.addToBookmarks(event).subscribe();
  }

  removeFromBookmarks(event: BookmarkEvent) {
    this.bookmarksService.removeFromBookmarks(event).subscribe();
  }

  rate(event: RateBookEvent) {
    this.bookService.rateBook(event).subscribe();
  }
}
