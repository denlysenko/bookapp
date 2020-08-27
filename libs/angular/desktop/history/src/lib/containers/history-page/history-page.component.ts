import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { HistoryPageBase } from '@bookapp/angular/base';
import { StoreService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';
import { LogsFilter } from '@bookapp/shared';

@Component({
  selector: 'bookapp-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LogsService],
})
export class HistoryPageComponent extends HistoryPageBase {
  constructor(logsService: LogsService, storeService: StoreService) {
    super(logsService, storeService);
  }

  sort({ active, direction }: Sort) {
    const orderBy = `${active}_${direction}` as LogsFilter['orderBy'];

    this.filter.next({
      ...this.filter.getValue(),
      orderBy,
    });

    this.logsService.refetch({ orderBy });
    this.updateFilterInStore();
  }

  paginate({ pageIndex, pageSize }: PageEvent) {
    const skip = pageIndex * pageSize;
    const first = pageSize;

    this.filter.next({
      ...this.filter.getValue(),
      skip,
      first,
    });

    this.logsService.refetch({ skip, first });
    this.updateFilterInStore();
  }
}
