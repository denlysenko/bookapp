import { inject, Injectable } from '@angular/core';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { ApiResponse, Log, LogsFilter } from '@bookapp/shared/interfaces';
import { LAST_LOGS_QUERY, LOG_CREATED_SUBSCRIPTION, LOGS_QUERY } from '@bookapp/shared/queries';

import { Apollo, QueryRef } from 'apollo-angular';

export const DEFAULT_ORDER_BY = 'createdAt_desc';

interface Variables {
  skip?: number;
  first?: number;
  orderBy?: string;
}

@Injectable({ providedIn: 'root' })
export class LogsService {
  readonly #apollo = inject(Apollo);

  #lastLogsQueryRef: QueryRef<{ logs: ApiResponse<Log> }> | null = null;
  #allLogsQueryRef: QueryRef<{ logs: ApiResponse<Log> }, Variables> | null = null;

  watchLastLogs() {
    if (!this.#lastLogsQueryRef) {
      this.#lastLogsQueryRef = this.#apollo.watchQuery<{ logs: ApiResponse<Log> }>({
        query: LAST_LOGS_QUERY,
      });
    }

    return this.#lastLogsQueryRef.valueChanges;
  }

  watchAllLogs(logsFilter: LogsFilter = {}) {
    if (!this.#allLogsQueryRef) {
      this.#allLogsQueryRef = this.#apollo.watchQuery({
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

    return this.#allLogsQueryRef.valueChanges;
  }

  subscribeToNewLogs(userId: string) {
    return this.#lastLogsQueryRef?.subscribeToMore<{ logCreated: Log }>({
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
    this.#allLogsQueryRef?.fetchMore({
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

  refetch(variables: Partial<Variables>) {
    this.#allLogsQueryRef?.refetch(variables);
  }
}
