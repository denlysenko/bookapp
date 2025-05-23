import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  viewChild,
} from '@angular/core';

import { HistoryPageBase } from '@bookapp/angular/base';
import { LoaderPlatformService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { LogsFilter } from '@bookapp/shared/interfaces';

import { Drawer } from '@nativescript-community/ui-drawer';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { action, Application, getViewById } from '@nativescript/core';

import { takeUntil } from 'rxjs/operators';

import { HistoryListComponent } from '../../components/history-list/history-list.component';

@Component({
  imports: [NativeScriptCommonModule, AsyncPipe, HistoryListComponent],
  templateUrl: './history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LogsService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HistoryPageComponent extends HistoryPageBase implements OnInit {
  readonly historyListView = viewChild<HistoryListComponent>(HistoryListComponent);

  readonly #loaderService = inject(LoaderPlatformService);

  #skip = 0;

  ngOnInit() {
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (loading ? this.#loaderService.start() : this.#loaderService.stop()));
  }

  onDrawerButtonTap() {
    const sideDrawer = getViewById(Application.getRootView(), 'drawer') as Drawer;
    sideDrawer.toggle();
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
      this.#skip += DEFAULT_LIMIT;

      this.filter.update((filter) => ({
        ...filter,
        skip: this.#skip,
      }));

      this.logsService.loadMore(this.#skip);
    }
  }

  private sort(direction: string) {
    this.#skip = 0;

    const skip = this.#skip;
    const orderBy = `createdAt_${direction}` as LogsFilter['orderBy'];

    this.filter.update((filter) => ({
      ...filter,
      skip,
      orderBy,
    }));

    this.logsService.refetch({ skip, orderBy });
    this.historyListView()?.scrollToIndex(0);
  }
}
