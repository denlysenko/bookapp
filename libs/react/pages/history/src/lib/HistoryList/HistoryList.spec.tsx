import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { UserActionsDesc } from '@bookapp/shared/enums';
import { book, log } from '@bookapp/testing';

import HistoryList, { HistoryListProps } from './HistoryList';

const logs = [];

for (let i = 0; i <= DEFAULT_LIMIT; i++) {
  logs.push({ ...log, _id: `${log._id}_${i}`, book });
}

const props: HistoryListProps = {
  logs,
  count: DEFAULT_LIMIT + 1,
  sorting: {
    active: 'createdAt',
    direction: 'desc',
  },
  pagination: {
    skip: 0,
    first: DEFAULT_LIMIT,
  },
  onSort: jest.fn(),
  onPaginate: jest.fn(),
};

describe('HistoryList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <HistoryList {...props} />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render logs', () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <HistoryList {...props} />
      </MemoryRouter>
    );
    expect(getAllByText(UserActionsDesc[log.action])).toHaveLength(11);
  });

  describe('Sorting', () => {
    it('should call onSort prop', () => {
      const { getByText } = render(
        <MemoryRouter>
          <HistoryList {...props} />
        </MemoryRouter>
      );

      fireEvent.click(getByText('Created At'));

      expect(props.onSort).toHaveBeenCalledTimes(1);
      expect(props.onSort).toHaveBeenCalledWith({
        ...props.sorting,
        direction: 'asc',
      });
    });
  });

  describe('Pagination', () => {
    it('should display count', () => {
      const { getByText } = render(
        <MemoryRouter>
          <HistoryList {...props} />
        </MemoryRouter>
      );

      expect(getByText('1-10 of 11')).toBeInTheDocument();
    });

    it('should call onPaginate prop when next page button clicked', () => {
      const { getByTitle } = render(
        <MemoryRouter>
          <HistoryList {...props} />
        </MemoryRouter>
      );

      fireEvent.click(getByTitle('Next page'));

      expect(props.onPaginate).toHaveBeenCalledTimes(1);
      expect(props.onPaginate).toHaveBeenCalledWith({
        pageIndex: props.pagination.skip + 1,
        pageSize: props.pagination.first,
      });
    });

    it('Next page button should be disabled', () => {
      const { getByTitle } = render(
        <MemoryRouter>
          <HistoryList {...props} count={9} />
        </MemoryRouter>
      );

      expect(getByTitle('Next page')).toBeDisabled();
    });
  });
});
