import { Injectable } from '@angular/core';

import { ApiResponse, LAST_LOGS_QUERY, Log } from '@bookapp/shared';

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
