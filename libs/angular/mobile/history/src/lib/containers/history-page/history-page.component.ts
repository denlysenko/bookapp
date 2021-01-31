import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { HistoryPageBase } from '@bookapp/angular/base';
import { LoaderPlatformService, StoreService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { LogsFilter } from '@bookapp/shared/interfaces';

import { takeUntil } from 'rxjs/operators';

import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

import { getViewById, action } from '@nativescript/core';
import { getRootView } from '@nativescript/core/application';

import { HistoryListComponent } from '../../components/history-list/history-list.component';

@Component({
  selector: 'bookapp-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LogsService],
})
export class HistoryPageComponent extends HistoryPageBase {
  @ViewChild(HistoryListComponent)
  historyListView: HistoryListComponent;

  private skip = 0;

  constructor(
    logsService: LogsService,
    storeService: StoreService,
    private readonly loaderService: LoaderPlatformService
  ) {
    super(logsService, storeService);
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.loaderService.start() : this.loaderService.stop()));
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(getRootView() as any, 'drawer') as RadSideDrawer;
    sideDrawer.toggleDrawerState();
  }

  async onFilterTap() {
    const result = await action({
      message: 'Sort By Creation Date',
      cancelButtonText: 'Cancel',
      actions: ['Ascending', 'Descending'],
    });

    if (result === 'Ascending') {
      return this.sort('asc');
    }

    if (result === 'Descending') {
      return this.sort('desc');
    }
  }

  loadMore() {
    if (this.pending) {
      return;
    }

    if (this.hasMoreItems) {
      this.skip += DEFAULT_LIMIT;

      this.filter.next({
        ...this.filter.getValue(),
        skip: this.skip,
      });

      this.logsService.loadMore(this.skip);
    }
  }

  private sort(direction: string) {
    this.skip = 0;

    const skip = this.skip;
    const orderBy = `createdAt_${direction}` as LogsFilter['orderBy'];

    this.filter.next({
      ...this.filter.getValue(),
      skip,
      orderBy,
    });

    this.logsService.refetch({ skip, orderBy });
    this.historyListView.scrollToIndex(0);
  }
}
