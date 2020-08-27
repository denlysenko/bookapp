import { Directive, OnDestroy } from '@angular/core';

import { AuthService, LogsService } from '@bookapp/angular/data-access';

import { map, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

@Directive()
export abstract class MainLayoutBase extends BaseComponent implements OnDestroy {
  user$ = this.authService.watchMe().pipe(
    map(({ data }) => data.me),
    tap((user) => {
      if (!this.unsubscribeFromNewLogs) {
        this.unsubscribeFromNewLogs = this.logsService.subscribeToNewLogs(user._id);
      }
    })
  );

  logs$ = this.logsService.watchLastLogs().pipe(map(({ data }) => data.logs.rows));

  private unsubscribeFromNewLogs: () => void | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly logsService: LogsService
  ) {
    super();
  }

  logout() {
    this.authService.logout().subscribe();
  }

  ngOnDestroy() {
    if (this.unsubscribeFromNewLogs) {
      this.unsubscribeFromNewLogs();
      this.unsubscribeFromNewLogs = null;
    }

    super.ngOnDestroy();
  }
}
