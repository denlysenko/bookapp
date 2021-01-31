import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BookmarksPageBase } from '@bookapp/angular/base';
import { LoaderPlatformService } from '@bookapp/angular/core';
import { BookmarksService } from '@bookapp/angular/data-access';

import { takeUntil } from 'rxjs/operators';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { getViewById } from '@nativescript/core';
import { getRootView } from '@nativescript/core/application';

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
    bookmarksService: BookmarksService,
    private readonly loaderService: LoaderPlatformService
  ) {
    super(route, bookmarksService);
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.loaderService.start() : this.loaderService.stop()));
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(getRootView() as any, 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }
}
