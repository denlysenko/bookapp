import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { BookmarksService, BookService } from '@bookapp/angular/data-access';

import { TabView } from 'tns-core-modules/ui/tab-view/tab-view';

@Component({
  moduleId: module.id,
  selector: 'bookapp-view-book-page',
  templateUrl: './view-book-page.component.html',
  styleUrls: ['./view-book-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService, BookService],
})
export class ViewBookPageComponent extends ViewBookPageBase {
  selectedIndex = 0;

  constructor(route: ActivatedRoute, bookService: BookService, bookmarksService: BookmarksService) {
    super(route, bookService, bookmarksService);
  }

  onIndexChanged(args: any) {
    const tabView = args.object as TabView;
    this.selectedIndex = tabView.selectedIndex === -1 ? 0 : tabView.selectedIndex;
  }
}
