import { Directive, inject, OnDestroy } from '@angular/core';

import { AuthService, LogsService } from '@bookapp/angular/data-access';

import { map, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

@Directive()
export abstract class MainLayoutBase extends BaseComponent implements OnDestroy {
  readonly #authService = inject(AuthService);
  readonly #logsService = inject(LogsService);

  readonly user$ = this.#authService.watchMe().pipe(
    map(({ data }) => data.me),
    tap((user) => {
      if (!this.#unsubscribeFromNewLogs) {
        this.#unsubscribeFromNewLogs = this.#logsService.subscribeToNewLogs(user.id);
      }
    })
  );

  readonly logs$ = this.#logsService.watchLastLogs().pipe(map(({ data }) => data.logs.rows));

  #unsubscribeFromNewLogs: () => void | null = null;

  logout() {
    this.#authService.logout().subscribe();
  }

  override ngOnDestroy() {
    if (this.#unsubscribeFromNewLogs) {
      this.#unsubscribeFromNewLogs();
      this.#unsubscribeFromNewLogs = null;
    }

    super.ngOnDestroy();
  }
}
