import { LogsService } from '@bookapp/angular/data-access';
import { Log } from '@bookapp/shared';

import { Observable } from 'rxjs';
import { filter, map, pluck, tap } from 'rxjs/operators';

export abstract class HistoryPageBase {
  readonly logsQueryRef = this.logsService.getLogs();
  hasMoreItems = false;

  logs$: Observable<Log[]> = this.logsQueryRef.valueChanges.pipe(
    filter(({ loading }) => !loading),
    tap(
      ({
        data: {
          logs: { rows, count },
        },
      }) => {
        this.hasMoreItems = rows.length !== count;
      }
    ),
    map(({ data }) => data.logs.rows)
  );

  count$: Observable<number> = this.logsQueryRef.valueChanges.pipe(
    filter(({ loading }) => !loading),
    map(({ data }) => data.logs.count)
  );

  loading$: Observable<boolean> = this.logsQueryRef.valueChanges.pipe(
    pluck('loading'),
    tap((loading) => {
      this.pending = loading;
    })
  );

  protected pending = false;

  constructor(private readonly logsService: LogsService) {}
}
