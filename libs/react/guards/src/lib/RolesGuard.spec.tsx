import React from 'react';
import { BrowserRouter as Router, Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { InMemoryCache } from '@apollo/client/core';
import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';
import { ME_QUERY } from '@bookapp/shared/queries';
import { user } from '@bookapp/testing';

import { RolesGuard } from './RolesGuard';

const TestRoute = () => <h1>You are on the test page</h1>;

describe('RolesGuard', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to auth page', async () => {
    jest.spyOn(store, 'get').mockReturnValue(undefined);

    render(
      <MockedProvider mocks={[]}>
        <Router>
          <Routes>
            <RolesGuard element={<TestRoute />} roles={['user']} />
          </Routes>
        </Router>
      </MockedProvider>
    );

    expect(window.location.pathname).toBe('/auth');
  });

  it('should navigate to home page', async () => {
    jest.spyOn(store, 'get').mockReturnValue('token');

    const cache = new InMemoryCache();
    cache.writeQuery({
      query: ME_QUERY,
      data: {
        me: { ...user, __typename: 'User' },
      },
    });

    render(
      <MockedProvider mocks={[]} cache={cache}>
        <MemoryRouter initialEntries={['/test']}>
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>test</div>} path="/test" />
            <RolesGuard element={<TestRoute />} roles={['admin']} path="/protected" />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/protected/i));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  it('should render', async () => {
    jest.spyOn(store, 'get').mockReturnValue('token');

    const cache = new InMemoryCache();
    cache.writeQuery({
      query: ME_QUERY,
      data: {
        me: { ...user, roles: ['admin'], __typename: 'User' },
      },
    });

    const { container } = render(
      <MockedProvider mocks={[]} cache={cache}>
        <MemoryRouter initialEntries={['/test']}>
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>test</div>} path="/test" />
            <RolesGuard element={<TestRoute />} roles={['admin']} path="/protected" />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/protected/i));

    await waitFor(() => {
      expect(container).toContainHTML('You are on the test page');
    });
  });
});
