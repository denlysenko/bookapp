import { Link } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import { UserActionsDesc } from '@bookapp/shared/enums';
import { Log, Pagination, Sorting } from '@bookapp/shared/interfaces';
import { formatDate } from '@bookapp/utils/react';

import { StyledHistoryList } from './StyledHistoryList';

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
    <TableContainer component={Paper}>
      <StyledHistoryList size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sorting.active === 'createdAt'}
                direction={sorting.direction}
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
            <TableRow key={log.id} data-testid="table-row">
              <TableCell>{formatDate(log.createdAt)}</TableCell>
              <TableCell>{UserActionsDesc[log.action]}</TableCell>
              <TableCell>
                <Link
                  to={
                    log.book.paid
                      ? `/books/buy/${log.book.url}?bookId=${log.book.id}`
                      : `/books/browse/${log.book.url}?bookId=${log.book.id}`
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
      </StyledHistoryList>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        component="div"
        slotProps={{
          select: {
            MenuProps: {
              className: 'pagination',
            },
          },
        }}
        count={count || 0}
        rowsPerPage={pagination.first}
        page={pagination.skip / pagination.first}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default HistoryList;
