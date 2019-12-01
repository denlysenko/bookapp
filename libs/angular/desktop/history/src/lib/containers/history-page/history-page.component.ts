import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { HistoryPageBase } from '@bookapp/angular/base';
import { LogsService } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent extends HistoryPageBase {
  constructor(logsService: LogsService) {
    super(logsService);
  }

  sort(event: Sort) {
    this.logsQueryRef.refetch({
      orderBy: `${event.active}_${event.direction}`
    });
  }

  paginate(event: PageEvent) {
    this.logsQueryRef.refetch({
      skip: event.pageIndex * event.pageSize,
      first: event.pageSize
    });
  }
}
