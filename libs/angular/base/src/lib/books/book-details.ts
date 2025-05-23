import { computed, Directive, input, output } from '@angular/core';

import { BOOKMARKS } from '@bookapp/shared/enums';
import { Book, BookmarkEvent } from '@bookapp/shared/interfaces';

@Directive()
export abstract class BookDetailsBase {
  readonly book = input<Book>();
  readonly bookmarks = input<string[]>();

  readonly bookmarkAdded = output<BookmarkEvent>();
  readonly bookmarkRemoved = output<BookmarkEvent>();
  readonly bookRated = output<{ bookId: string; rate: number }>();

  readonly BOOKMARKS = BOOKMARKS;

  readonly inFavorites = computed(() => {
    const bookmarks = this.bookmarks();
    return bookmarks && bookmarks.includes(BOOKMARKS.FAVORITES);
  });

  readonly inWishlist = computed(() => {
    const bookmarks = this.bookmarks();
    return bookmarks && bookmarks.includes(BOOKMARKS.WISHLIST);
  });

  readonly inMustread = computed(() => {
    const bookmarks = this.bookmarks();
    return bookmarks && bookmarks.includes(BOOKMARKS.MUSTREAD);
  });

  rate(rate: number) {
    this.bookRated.emit({ bookId: this.book().id, rate });
  }
}
