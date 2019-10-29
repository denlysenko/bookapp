import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { BookmarksService, BooksService } from '@bookapp/angular/data-access';

import { TabView } from 'tns-core-modules/ui/tab-view/tab-view';

@Component({
  moduleId: module.id,
  selector: 'bookapp-view-book-page',
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss']
})
export class ViewBookPageComponent extends ViewBookPageBase {
  selectedIndex = 0;

  constructor(
    route: ActivatedRoute,
    booksService: BooksService,
    bookmarksService: BookmarksService
  ) {
    super(route, booksService, bookmarksService);
  }

  onIndexChanged(args: any) {
    const tabView = args.object as TabView;
    this.selectedIndex =
      tabView.selectedIndex === -1 ? 0 : tabView.selectedIndex;
  }
}
