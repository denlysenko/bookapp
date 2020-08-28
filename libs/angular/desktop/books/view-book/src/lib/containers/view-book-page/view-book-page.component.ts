import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { AuthService, BookmarksService, BookService } from '@bookapp/angular/data-access';

import { map } from 'rxjs/operators';

@Component({
  selector: 'bookapp-view-book-page',
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService, BookService],
})
export class ViewBookPageComponent extends ViewBookPageBase {
  user$ = this.authService.fetchMe().pipe(map(({ data }) => data.me));

  constructor(
    route: ActivatedRoute,
    bookService: BookService,
    bookmarksService: BookmarksService,
    private readonly authService: AuthService
  ) {
    super(route, bookService, bookmarksService);
  }
}
