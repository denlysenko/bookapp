import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookmarksPageBase } from '@bookapp/angular/base';
import { BookmarksService, BooksService } from '@bookapp/angular/data-access';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import * as app from 'tns-core-modules/application';
import { getViewById } from 'tns-core-modules/ui/page/page';

@Component({
  moduleId: module.id,
  selector: 'bookapp-bookmarks-page',
  templateUrl: './bookmarks-page.component.html',
  styleUrls: ['./bookmarks-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService],
})
export class BookmarksPageComponent extends BookmarksPageBase {
  constructor(
    route: ActivatedRoute,
    booksService: BooksService,
    bookmarksService: BookmarksService
  ) {
    super(route, booksService, bookmarksService);
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(app.getRootView(), 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }
}
