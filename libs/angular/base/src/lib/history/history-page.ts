import { inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { StoreService } from '@bookapp/angular/core';
import { LogsService } from '@bookapp/angular/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { Log, LogsFilter, Sorting } from '@bookapp/shared/interfaces';

import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, take, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

const FILTER_KEY = 'HISTORY';

export abstract class HistoryPageBase extends BaseComponent {
  readonly #storeService = inject(StoreService);
  protected readonly logsService = inject(LogsService);

  readonly hasMoreItems = signal(false);
  readonly filter = signal<LogsFilter>(this.#storeService.get(FILTER_KEY));

  readonly sorting$ = toObservable(this.filter).pipe(
    map((logsFilter) => {
      if (logsFilter?.orderBy) {
        const [active, direction] = logsFilter.orderBy.split('_');

        return {
          active,
          direction,
        } as Sorting;
      }

      return {
        active: 'createdAt',
        direction: 'desc',
      } as Sorting;
    }),
    take(1)
  );

  readonly pagination$ = toObservable(this.filter).pipe(
    map((logsFilter) => {
      if (logsFilter) {
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
    .watchAllLogs(this.filter())
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly logs$: Observable<Log[]> = this.source$.pipe(
    filter(({ data }) => !!data.logs),
    tap(({ data }) => {
      const { rows, count } = data.logs;
      this.hasMoreItems.set(rows.length !== count);
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

  protected updateFilterInStore() {
    this.#storeService.set(FILTER_KEY, this.filter());
  }
}
