import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { LogsService } from '@bookapp/angular/data-access';
import { Log } from '@bookapp/shared';

import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

export abstract class HistoryPageBase {
  readonly logsQueryRef = this.logsService.getLogs();

  logs$: Observable<Log[]> = this.logsQueryRef.valueChanges.pipe(
    map(({ data }) => data.logs.rows)
  );
  count$: Observable<number> = this.logsQueryRef.valueChanges.pipe(
    map(({ data }) => data.logs.count)
  );

  loading$: Observable<boolean> = this.logsQueryRef.valueChanges.pipe(
    pluck('loading')
  );

  constructor(private readonly logsService: LogsService) {}

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
