import { Injectable } from '@angular/core';

import { ApiResponse, Log } from '@bookapp/shared/models';
import { LAST_LOGS_QUERY } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';

@Injectable()
export class LogsService {
  constructor(private readonly apollo: Apollo) {}

  getLastLogs() {
    return this.apollo.watchQuery<{ logs: ApiResponse<Log> }>({
      query: LAST_LOGS_QUERY
    });
  }
}
