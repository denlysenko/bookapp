import { useEffect, useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { store } from '@bookapp/react/core';
import { useHistory } from '@bookapp/react/data-access';
import { FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { LogsFilter, Pagination, Sorting } from '@bookapp/shared/interfaces';

import HistoryList from './HistoryList/HistoryList';
import { StyledHistory } from './StyledHistory';

const FILTER_KEY = 'HISTORY';

export function History() {
  const [filter, setFilter] = useState<LogsFilter>(() => store.get(FILTER_KEY));
  const { loading, refetch, logs } = useHistory(filter);

  useEffect(() => {
    store.set(FILTER_KEY, filter);
  }, [filter]);

  const getSorting = (): Sorting => {
    if (filter && filter.orderBy) {
      const [active, direction] = filter.orderBy.split('_');

      return {
        active,
        direction: direction as Sorting['direction'],
      };
    }

    return {
      active: 'createdAt',
      direction: 'desc' as Sorting['direction'],
    };
  };

  const getPagination = (): Pagination => {
    if (filter) {
      return {
        skip: filter.skip || 0,
        first: filter.first || DEFAULT_LIMIT,
      };
    }

    return {
      skip: 0,
      first: DEFAULT_LIMIT,
    };
  };

  const sort = ({ active, direction }) => {
    const orderBy = `${active}_${direction}` as LogsFilter['orderBy'];
    setFilter({ ...filter, orderBy });
    refetch({ orderBy });
  };

  const paginate = ({ pageIndex, pageSize }) => {
    const skip = pageIndex * pageSize;
    const first = pageSize;
    setFilter({ ...filter, skip, first });
    refetch({ skip, first });
  };

  return (
    <>
      {loading && <FullPageSpinner />}
      <StyledHistory>
        <Toolbar disableGutters={true}>
          <Typography component="span">History</Typography>
        </Toolbar>
        <div className="view-content">
          <HistoryList
            logs={logs && logs.rows}
            count={logs && logs.count}
            sorting={getSorting()}
            pagination={getPagination()}
            onSort={sort}
            onPaginate={paginate}
          />
        </div>
      </StyledHistory>
    </>
  );
}

export default History;
