import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';

import { BestBooksBase } from '@bookapp/angular/base';
import { LoaderPlatformService } from '@bookapp/angular/core';
import { BestBooksService } from '@bookapp/angular/data-access';
import { BooksListComponent } from '@bookapp/angular/ui-mobile';

import { Drawer } from '@nativescript-community/ui-drawer';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { Application, getViewById } from '@nativescript/core';

import { takeUntil } from 'rxjs/operators';

@Component({
  imports: [NativeScriptCommonModule, AsyncPipe, BooksListComponent],
  templateUrl: './best-books-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BestBooksService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class BestBooksPageComponent extends BestBooksBase implements OnInit {
  readonly #loaderService = inject(LoaderPlatformService);

  ngOnInit(): void {
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.#loaderService.start() : this.#loaderService.stop()));
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(Application.getRootView(), 'drawer') as Drawer;
    sideDrawer.toggle();
  }
}
