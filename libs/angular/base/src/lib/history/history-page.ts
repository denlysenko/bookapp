import { DEFAULT_LIMIT, StoreService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';
import { Log, LogsFilter } from '@bookapp/shared/interfaces';

import { isNil } from 'lodash';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, take, tap } from 'rxjs/operators';

const FILTER_KEY = 'HISTORY';

export abstract class HistoryPageBase {
  hasMoreItems = false;

  readonly filter = new BehaviorSubject<LogsFilter>(this.storeService.get(FILTER_KEY));

  readonly sorting$ = this.filter.asObservable().pipe(
    map((logsFilter) => {
      if (!isNil(logsFilter) && !isNil(logsFilter.orderBy)) {
        const [active, direction] = logsFilter.orderBy.split('_');

        return {
          active,
          direction,
        };
      }

      return {
        active: 'createdAt',
        direction: 'desc',
      };
    }),
    take(1)
  );

  readonly pagination$ = this.filter.asObservable().pipe(
    map((logsFilter) => {
      if (!isNil(logsFilter)) {
        return {
          skip: logsFilter.skip || 0,
          first: logsFilter.first || DEFAULT_LIMIT,
        };
      }

      return {
        skip: 0,
        first: DEFAULT_LIMIT,
      };
    }),
    take(1)
  );

  readonly source$ = this.logsService
    .watchAllLogs(this.filter.getValue())
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly logs$: Observable<Log[]> = this.source$.pipe(
    filter(({ data }) => !!data.logs),
    tap(({ data }) => {
      const { rows, count } = data.logs;
      this.hasMoreItems = rows.length !== count;
    }),
    map(({ data }) => data.logs.rows)
  );

  readonly count$: Observable<number> = this.source$.pipe(
    filter(({ data }) => !!data.logs),
    map(({ data }) => data.logs.count)
  );

  readonly loading$: Observable<boolean> = this.source$.pipe(
    startWith({ loading: true }),
    map(({ loading }) => loading),
    tap((loading) => {
      this.pending = loading;
    })
  );

  protected pending = false;

  constructor(
    protected readonly logsService: LogsService,
    private readonly storeService: StoreService
  ) {}

  protected updateFilterInStore() {
    this.storeService.set(FILTER_KEY, this.filter.getValue());
  }
}
