import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HistoryPageBase } from '@bookapp/angular/base';
import { PreloaderComponent } from '@bookapp/angular/ui-desktop';
import { LogsFilter } from '@bookapp/shared/interfaces';

import { HistoryListComponent } from '../../components/history-list/history-list.component';

@Component({
  imports: [AsyncPipe, MatToolbarModule, PreloaderComponent, HistoryListComponent],
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent extends HistoryPageBase {
  sort({ active, direction }: Sort) {
    const orderBy = `${active}_${direction}` as LogsFilter['orderBy'];

    this.filter.update((filter) => ({ ...filter, orderBy }));
    this.logsService.refetch({ orderBy });
    this.updateFilterInStore();
  }

  paginate({ pageIndex, pageSize }: PageEvent) {
    const skip = pageIndex * pageSize;
    const first = pageSize;

    this.filter.update((filter) => ({
      ...filter,
      skip,
      first,
    }));

    this.logsService.refetch({ skip, first });
    this.updateFilterInStore();
  }
}
