import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { InMemoryCache } from '@apollo/client/core';
import { MockedProvider } from '@apollo/client/testing';

import { LAST_LOGS_QUERY, LOG_CREATED_SUBSCRIPTION, ME_QUERY } from '@bookapp/shared/queries';
import { userWithTypename } from '@bookapp/testing';

import Nav from './Nav';

const logsMock = {
  request: {
    query: LAST_LOGS_QUERY,
  },
  result: {
    data: {
      rows: [],
    },
  },
};

const subscriptionMock = {
  request: {
    query: LOG_CREATED_SUBSCRIPTION,
    variables: { userId: userWithTypename._id },
  },
  result: {
    data: {
      logCreated: {},
    },
  },
};

describe('Nav', () => {
  it('should render successfully', () => {
    const cache = new InMemoryCache();
    cache.writeQuery({
      query: ME_QUERY,
      data: {
        me: userWithTypename,
      },
    });

    const { baseElement } = render(
      <MemoryRouter>
        <MockedProvider cache={cache} mocks={[logsMock, subscriptionMock]}>
          <Nav />
        </MockedProvider>
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('add book link', () => {
    it('should be invisible for non admin', async () => {
      const cache = new InMemoryCache();
      cache.writeQuery({
        query: ME_QUERY,
        data: {
          me: userWithTypename,
        },
      });

      render(
        <MemoryRouter>
          <MockedProvider cache={cache} mocks={[logsMock, subscriptionMock]}>
            <Nav />
          </MockedProvider>
        </MemoryRouter>
      );

      await Promise.resolve();

      expect(screen.queryByText(/add book/i)).not.toBeInTheDocument();
    });

    it('should be visible for admin', async () => {
      const cache = new InMemoryCache();
      cache.writeQuery({
        query: ME_QUERY,
        data: {
          me: { ...userWithTypename, roles: ['admin'] },
        },
      });

      render(
        <MemoryRouter>
          <MockedProvider cache={cache} mocks={[logsMock, subscriptionMock]}>
            <Nav />
          </MockedProvider>
        </MemoryRouter>
      );

      await Promise.resolve();

      expect(screen.getByText(/add book/i)).toBeInTheDocument();
    });
  });
});
