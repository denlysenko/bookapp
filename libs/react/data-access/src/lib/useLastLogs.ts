import { useEffect } from 'react';

import { useQuery } from '@apollo/client/react';

import { ApiResponse, Log } from '@bookapp/shared/interfaces';
import { LAST_LOGS_QUERY, LOG_CREATED_SUBSCRIPTION } from '@bookapp/shared/queries';

export function useLastLogs(userId: string) {
  const { data, subscribeToMore } = useQuery<{ logs: ApiResponse<Log> }>(LAST_LOGS_QUERY);

  useEffect(() => {
    const unsubscribe = subscribeToMore<{ logCreated: Log }>({
      document: LOG_CREATED_SUBSCRIPTION,
      variables: { userId },
      updateQuery: (_, { complete, subscriptionData, previousData }) => {
        if (!complete) {
          return undefined;
        }

        if (!subscriptionData.data) {
          return previousData;
        }

        const newLogs = [subscriptionData.data.logCreated, ...previousData.logs.rows];

        if (newLogs.length > 3) {
          newLogs.pop();
        }

        return {
          logs: {
            rows: newLogs,
            count: previousData.logs.count,
            __typename: 'LogsResponse' as const,
          },
        };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, userId]);

  return {
    logs: data && data.logs.rows,
  };
}
