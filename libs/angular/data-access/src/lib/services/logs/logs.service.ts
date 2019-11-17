import { Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { ApiResponse, LAST_LOGS_QUERY, Log, LOGS_QUERY } from '@bookapp/shared';

import { Apollo } from 'apollo-angular';

export const DEFAULT_ORDER_BY = 'createdAt_desc';

@Injectable()
export class LogsService {
  constructor(private readonly apollo: Apollo) {}

  getLastLogs() {
    return this.apollo.watchQuery<{ logs: ApiResponse<Log> }>({
      query: LAST_LOGS_QUERY
    });
  }

  getLogs(orderBy = DEFAULT_ORDER_BY, skip = 0, first = DEFAULT_LIMIT) {
    return this.apollo.watchQuery<{ logs: ApiResponse<Log> }>({
      query: LOGS_QUERY,
      variables: {
        skip,
        first,
        orderBy
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    });
  }
}
