import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { AuthFacade, BookmarksService, BooksService } from '@bookapp/angular/data-access';

import { map } from 'rxjs/operators';

@Component({
  selector: 'bookapp-view-book-page',
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss'],
})
export class ViewBookPageComponent extends ViewBookPageBase {
  user$ = this.authFacade.me().pipe(map(({ data }) => data.me));

  constructor(
    route: ActivatedRoute,
    booksService: BooksService,
    bookmarksService: BookmarksService,
    private readonly authFacade: AuthFacade
  ) {
    super(route, booksService, bookmarksService);
  }
}
