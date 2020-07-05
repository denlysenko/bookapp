import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { Book, BookmarkEvent, BOOKMARKS } from '@bookapp/shared';

@Directive()
export abstract class BookDetailsBase {
  readonly BOOKMARKS = BOOKMARKS;

  @Input() book: Book;
  @Input() bookmarks: string[];

  @Output() bookmarkAdded = new EventEmitter<BookmarkEvent>();
  @Output() bookmarkRemoved = new EventEmitter<BookmarkEvent>();
  @Output() bookRated = new EventEmitter<{ bookId: string; rate: number }>();

  get inFavorites(): boolean {
    return this.bookmarks && this.bookmarks.includes(BOOKMARKS.FAVORITES);
  }

  get inWishlist(): boolean {
    return this.bookmarks && this.bookmarks.includes(BOOKMARKS.WISHLIST);
  }

  get inMustread(): boolean {
    return this.bookmarks && this.bookmarks.includes(BOOKMARKS.MUSTREAD);
  }

  rate(rate: number) {
    this.bookRated.emit({ bookId: this.book._id, rate });
  }
}
