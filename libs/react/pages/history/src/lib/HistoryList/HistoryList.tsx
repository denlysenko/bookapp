import React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { UserActionsDesc } from '@bookapp/shared/enums';
import { Log, Pagination, Sorting } from '@bookapp/shared/interfaces';
import { formatDate } from '@bookapp/utils/react';

import { useHistoryListStyles } from './useHistoryListStyles';

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}

export interface HistoryListProps {
  logs: Log[];
  count: number;
  sorting: Sorting;
  pagination: Pagination;
  onSort: (sorting: Sorting) => void;
  onPaginate: (event: PageEvent) => void;
}

export function HistoryList({
  logs = [],
  count,
  sorting,
  pagination,
  onSort,
  onPaginate,
}: HistoryListProps) {
  const classes = useHistoryListStyles();

  const handleSort = (property: string) => {
    const direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    onSort({ active: property, direction });
  };

  const handleChangePage = (_: unknown, page: number) => {
    onPaginate({ pageIndex: page, pageSize: pagination.first });
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPaginate({
      pageIndex: pagination.skip / pagination.first,
      pageSize: parseInt(e.target.value, 10),
    });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sorting.active === 'createdAt'}
                  direction={sorting.direction}
                  // tslint:disable-next-line: jsx-no-lambda
                  onClick={() => handleSort('createdAt')}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Book</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id} data-testid="table-row">
                <TableCell>{formatDate(log.createdAt)}</TableCell>
                <TableCell>{UserActionsDesc[log.action]}</TableCell>
                <TableCell>
                  <Link
                    to={
                      log.book.paid
                        ? `/books/buy/${log.book.url}?bookId=${log.book._id}`
                        : `/books/browse/${log.book.url}?bookId=${log.book._id}`
                    }
                  >
                    {log.book.title}
                  </Link>
                  <br />
                  <small> by {log.book.author}</small>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          component="div"
          SelectProps={{
            MenuProps: {
              className: classes.pagination,
            },
          }}
          count={count || 0}
          rowsPerPage={pagination.first}
          page={pagination.skip / pagination.first}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}

export default HistoryList;
