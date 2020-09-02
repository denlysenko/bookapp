import { Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/angular/core';
import { ApiResponse, Log, LogsFilter } from '@bookapp/shared/interfaces';
import { LAST_LOGS_QUERY, LOGS_QUERY, LOG_CREATED_SUBSCRIPTION } from '@bookapp/shared/queries';

import { Apollo, QueryRef } from 'apollo-angular';
import { EmptyObject } from 'apollo-angular/types';

import { isNil } from 'lodash';

export const DEFAULT_ORDER_BY = 'createdAt_desc';

@Injectable()
export class LogsService {
  private lastLogsQueryRef: QueryRef<{ logs: ApiResponse<Log> }> | null = null;
  private allLogsQueryRef: QueryRef<{ logs: ApiResponse<Log> }> | null = null;

  constructor(private readonly apollo: Apollo) {}

  watchLastLogs() {
    if (isNil(this.lastLogsQueryRef)) {
      this.lastLogsQueryRef = this.apollo.watchQuery<{ logs: ApiResponse<Log> }>({
        query: LAST_LOGS_QUERY,
      });
    }

    return this.lastLogsQueryRef.valueChanges;
  }

  watchAllLogs(logsFilter: LogsFilter = {}) {
    if (isNil(this.allLogsQueryRef)) {
      this.allLogsQueryRef = this.apollo.watchQuery<{ logs: ApiResponse<Log> }>({
        query: LOGS_QUERY,
        variables: {
          skip: logsFilter.skip || 0,
          first: logsFilter.first || DEFAULT_LIMIT,
          orderBy: logsFilter.orderBy || DEFAULT_ORDER_BY,
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
      });
    }

    return this.allLogsQueryRef.valueChanges;
  }

  subscribeToNewLogs(userId: string) {
    if (isNil(this.lastLogsQueryRef)) {
      return;
    }

    return this.lastLogsQueryRef.subscribeToMore({
      document: LOG_CREATED_SUBSCRIPTION,
      variables: { userId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newLogs = [subscriptionData.data.logCreated, ...prev.logs.rows];

        if (newLogs.length > 3) {
          newLogs.pop();
        }

        return {
          logs: {
            rows: newLogs,
            count: prev.logs.count,
            __typename: 'LogsResponse',
          },
        };
      },
    });
  }

  loadMore(skip: number) {
    if (isNil(this.allLogsQueryRef)) {
      return;
    }

    this.allLogsQueryRef.fetchMore({
      variables: {
        skip,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        const { rows, count } = fetchMoreResult.logs;

        return {
          logs: {
            count,
            rows: [...previousResult.logs.rows, ...rows],
            __typename: 'LogsResponse',
          },
        };
      },
    });
  }

  refetch(variables: EmptyObject) {
    if (isNil(this.allLogsQueryRef)) {
      return;
    }

    this.allLogsQueryRef.refetch(variables);
  }
}
