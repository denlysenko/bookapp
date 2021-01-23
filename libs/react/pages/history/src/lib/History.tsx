import React, { useEffect, useRef } from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { isNil } from 'lodash';

import { store } from '@bookapp/react/core';
import { useHistory } from '@bookapp/react/data-access';
import { FullPageSpinner } from '@bookapp/react/ui';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { LogsFilter, Pagination, Sorting } from '@bookapp/shared/interfaces';

import HistoryList from './HistoryList/HistoryList';
import { useHistoryStyles } from './useHistoryStyles';

const FILTER_KEY = 'HISTORY';

export function History() {
  const classes = useHistoryStyles();
  const filter = useRef<LogsFilter>(store.get(FILTER_KEY));
  const { loading, refetch, logs } = useHistory(filter.current);

  useEffect(() => {
    store.set(FILTER_KEY, filter.current);
  }, [filter.current]);

  const getSorting = (): Sorting => {
    if (!isNil(filter.current) && !isNil(filter.current.orderBy)) {
      const [active, direction] = filter.current.orderBy.split('_');

      return {
        active,
        direction: direction as any,
      };
    }

    return {
      active: 'createdAt',
      direction: 'desc',
    };
  };

  const getPagination = (): Pagination => {
    if (!isNil(filter.current)) {
      return {
        skip: filter.current.skip || 0,
        first: filter.current.first || DEFAULT_LIMIT,
      };
    }

    return {
      skip: 0,
      first: DEFAULT_LIMIT,
    };
  };

  const sort = ({ active, direction }) => {
    const orderBy = `${active}_${direction}` as LogsFilter['orderBy'];
    filter.current = { ...filter.current, orderBy };
    refetch({ orderBy });
  };

  const paginate = ({ pageIndex, pageSize }) => {
    const skip = pageIndex * pageSize;
    const first = pageSize;
    filter.current = { ...filter.current, skip, first };
    refetch({ skip, first });
  };

  return (
    <>
      {loading && <FullPageSpinner />}
      <div className={classes.root}>
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
      </div>
    </>
  );
}

export default History;
