import { OnDestroy } from '@angular/core';

import { AuthService, LogsService } from '@bookapp/angular/data-access';
import { LOG_CREATED_SUBSCRIPTION } from '@bookapp/shared';

import { map, tap } from 'rxjs/operators';

import { BaseComponent } from '../core/base-component';

export abstract class MainLayoutBase extends BaseComponent implements OnDestroy {
  user$ = this.authService.me().valueChanges.pipe(
    map(({ data }) => data.me),
    tap(user => {
      if (!this.unsubscribeFromNewLogs) {
        this.subscribeToNewLogs(user._id);
      }
    })
  );

  logsQueryRef = this.logsService.getLastLogs();

  logs$ = this.logsQueryRef.valueChanges.pipe(map(({ data }) => data.logs.rows));

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

  private subscribeToNewLogs(userId: string) {
    this.unsubscribeFromNewLogs = this.logsQueryRef.subscribeToMore({
      document: LOG_CREATED_SUBSCRIPTION,
      variables: { userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newLogs = [subscriptionData.data.logCreated, ...prev.logs.rows];
        newLogs.pop();

        return {
          logs: {
            rows: newLogs,
            count: prev.logs.count,
            __typename: 'LogsResponse'
          }
        };
      }
    });
  }
}
