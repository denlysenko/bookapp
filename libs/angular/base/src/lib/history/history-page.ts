import { LogsService } from '@bookapp/angular/data-access';
import { Log } from '@bookapp/shared';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

export abstract class HistoryPageBase {
  readonly logsQueryRef = this.logsService.getLogs();

  logs$: Observable<Log[]> = this.logsQueryRef.valueChanges.pipe(
    tap(({ data: { logs: { rows, count } } }) => {
      if (rows.length === count) {
        this.hasMoreItems.next(false);
      }
    }),
    map(({ data }) => data.logs.rows)
  );

  count$: Observable<number> = this.logsQueryRef.valueChanges.pipe(
    map(({ data }) => data.logs.count)
  );

  loading$: Observable<boolean> = this.logsQueryRef.valueChanges.pipe(
    pluck('loading'),
    tap(loading => {
      this.pending = loading;
    })
  );

  protected pending = false;
  protected hasMoreItems = new BehaviorSubject<boolean>(true);

  constructor(private readonly logsService: LogsService) {}
}
