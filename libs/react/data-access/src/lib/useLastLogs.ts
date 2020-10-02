import { useEffect } from 'react';

import { useQuery } from '@apollo/client';

import { ApiResponse, Log } from '@bookapp/shared/interfaces';
import { LAST_LOGS_QUERY, LOG_CREATED_SUBSCRIPTION } from '@bookapp/shared/queries';

export function useLastLogs(userId: string) {
  const { data, subscribeToMore } = useQuery<{ logs: ApiResponse<Log> }>(LAST_LOGS_QUERY);

  useEffect(() => {
    const unsubscribe = subscribeToMore<{ logCreated: Log }>({
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

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return {
    logs: data && data.logs.rows,
  };
}
