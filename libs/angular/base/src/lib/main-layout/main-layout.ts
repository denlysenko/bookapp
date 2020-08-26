import { Directive, OnDestroy } from '@angular/core';

import { AuthFacade, LogsService } from '@bookapp/angular/data-access';

import { map, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

@Directive()
export abstract class MainLayoutBase extends BaseComponent implements OnDestroy {
  user$ = this.authFacade.watchMe().pipe(
    map(({ data }) => data.me),
    tap((user) => {
      if (!this.unsubscribeFromNewLogs) {
        this.unsubscribeFromNewLogs = this.logsService.subscribeToNewLogs(user._id);
      }
    })
  );

  logs$ = this.logsService.getLastLogs();

  private unsubscribeFromNewLogs: () => void | null = null;

  constructor(private readonly authFacade: AuthFacade, private readonly logsService: LogsService) {
    super();
  }

  logout() {
    this.authFacade.logout().subscribe();
  }

  ngOnDestroy() {
    if (this.unsubscribeFromNewLogs) {
      this.unsubscribeFromNewLogs();
      this.unsubscribeFromNewLogs = null;
    }

    super.ngOnDestroy();
  }
}
