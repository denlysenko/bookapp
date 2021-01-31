import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ViewBookPageBase } from '@bookapp/angular/base';
import { LoaderPlatformService } from '@bookapp/angular/core';
import { BookmarksService, BookService } from '@bookapp/angular/data-access';

import { TabView } from '@nativescript/core';

import { takeUntil } from 'rxjs/operators';

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

  constructor(
    route: ActivatedRoute,
    bookService: BookService,
    bookmarksService: BookmarksService,
    private readonly loaderService: LoaderPlatformService
  ) {
    super(route, bookService, bookmarksService);
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.loaderService.start() : this.loaderService.stop()));
  }

  onIndexChanged(args: any) {
    const tabView = args.object as TabView;
    this.selectedIndex = tabView.selectedIndex === -1 ? 0 : tabView.selectedIndex;
  }
}
