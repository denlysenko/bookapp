import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';

import { BookmarksPageBase } from '@bookapp/angular/base';
import { LoaderPlatformService } from '@bookapp/angular/core';
import { BookmarksService } from '@bookapp/angular/data-access';
import { BooksListComponent } from '@bookapp/angular/ui-mobile';

import { Drawer } from '@nativescript-community/ui-drawer';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, getViewById } from '@nativescript/core';

import { takeUntil } from 'rxjs/operators';

@Component({
  imports: [NativeScriptCommonModule, AsyncPipe, BooksListComponent],
  templateUrl: './bookmarks-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BookmarksService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BookmarksPageComponent extends BookmarksPageBase implements OnInit {
  readonly #loaderService = inject(LoaderPlatformService);

  ngOnInit() {
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.#loaderService.start() : this.#loaderService.stop()));
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(Application.getRootView(), 'drawer') as Drawer;
    sideDrawer.toggle();
  }
}
