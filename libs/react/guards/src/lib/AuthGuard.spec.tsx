import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';

import { InMemoryCache } from '@apollo/client/core';
import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';
import { ME_QUERY } from '@bookapp/shared/queries';
import { user } from '@bookapp/testing';

import { AuthGuard } from './AuthGuard';

const TestRoute = () => <h1>You are on the test page</h1>;

describe('AuthGuard', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to auth page', () => {
    jest.spyOn(store, 'get').mockReturnValue(undefined);

    render(
      <MockedProvider mocks={[]}>
        <Router>
          <Routes>
            <AuthGuard element={<TestRoute />} />
          </Routes>
        </Router>
      </MockedProvider>
    );

    expect(window.location.pathname).toBe('/auth');
  });

  it('should render if loggedIn', async () => {
    jest.spyOn(store, 'get').mockReturnValue('token');

    const cache = new InMemoryCache();
    cache.writeQuery({
      query: ME_QUERY,
      data: {
        me: { ...user, __typename: 'User' },
      },
    });

    const { container } = render(
      <MockedProvider mocks={[]} cache={cache}>
        <Router>
          <Routes>
            <AuthGuard element={<TestRoute />} />
          </Routes>
        </Router>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container).toContainHTML('You are on the test page');
    });
  });
});
