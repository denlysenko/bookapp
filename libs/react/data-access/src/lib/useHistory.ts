import { useQuery } from '@apollo/client';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { ApiResponse, Log, LogsFilter } from '@bookapp/shared/interfaces';
import { LOGS_QUERY } from '@bookapp/shared/queries';

const DEFAULT_ORDER_BY = 'createdAt_desc';

export function useHistory(logsFilter: LogsFilter = {}) {
  const { data, loading, refetch } = useQuery<{ logs: ApiResponse<Log> }>(LOGS_QUERY, {
    variables: {
      skip: logsFilter.skip || 0,
      first: logsFilter.first || DEFAULT_LIMIT,
      orderBy: logsFilter.orderBy || DEFAULT_ORDER_BY,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return {
    logs: data && data.logs,
    loading,
    refetch,
  };
}
