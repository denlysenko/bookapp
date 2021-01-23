import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { LOGS_QUERY } from '@bookapp/shared/queries';
import { book, log } from '@bookapp/testing';

import History from './History';

const DEFAULT_ORDER_BY = 'createdAt_desc';
const logs = [];

for (let i = 0; i < DEFAULT_LIMIT; i++) {
  logs.push({
    ...log,
    _id: `${log._id}_${i}`,
    book: { ...book, __typename: 'Book' },
    __typename: 'Log',
  });
}

const mock = {
  request: {
    query: LOGS_QUERY,
    variables: {
      skip: 0,
      first: DEFAULT_LIMIT,
      orderBy: DEFAULT_ORDER_BY,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  },
  result: {
    data: {
      logs: {
        rows: logs,
        count: 11,
        __typename: 'LogsResponse',
      },
    },
  },
};

describe('History', () => {
  beforeEach(() => {
    jest.spyOn(store, 'get').mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', async () => {
    const { baseElement } = render(
      <MemoryRouter>
        <MockedProvider mocks={[mock]}>
          <History />
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
