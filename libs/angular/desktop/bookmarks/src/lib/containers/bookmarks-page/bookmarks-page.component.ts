import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookmarksPageBase } from '@bookapp/angular/base';
import { BookmarksService, BooksService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-bookmarks-page',
  templateUrl: './bookmarks-page.component.html',
  styleUrls: ['./bookmarks-page.component.scss']
})
export class BookmarksPageComponent extends BookmarksPageBase {
  constructor(
    route: ActivatedRoute,
    booksService: BooksService,
    bookmarksService: BookmarksService
  ) {
    super(route, booksService, bookmarksService);
  }
}
