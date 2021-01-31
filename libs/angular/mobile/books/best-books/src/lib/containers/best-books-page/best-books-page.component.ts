import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BestBooksBase } from '@bookapp/angular/base';
import { LoaderPlatformService } from '@bookapp/angular/core';
import { BestBooksService } from '@bookapp/angular/data-access';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { takeUntil } from 'rxjs/operators';

import { getViewById } from '@nativescript/core';
import { getRootView } from '@nativescript/core/application';

@Component({
  moduleId: module.id,
  selector: 'bookapp-best-books-page',
  templateUrl: './best-books-page.component.html',
  styleUrls: ['./best-books-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BestBooksService],
})
export class BestBooksPageComponent extends BestBooksBase {
  constructor(
    booksService: BestBooksService,
    private readonly loaderService: LoaderPlatformService
  ) {
    super(booksService);
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.loaderService.start() : this.loaderService.stop()));
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(getRootView() as any, 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }
}
