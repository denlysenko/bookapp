import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { InMemoryCache } from '@apollo/client/core';
import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';
import { ME_QUERY } from '@bookapp/shared/queries';
import { user } from '@bookapp/testing/react';

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
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>root</div>} path="/" />
            <Route element={<div>auth</div>} path="/auth" />
            <Route
              element={
                <AuthGuard>
                  <TestRoute />
                </AuthGuard>
              }
              path="/protected"
            />
          </Routes>
        </Router>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/protected/i));
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
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>root</div>} path="/" />
            <Route
              element={
                <AuthGuard>
                  <TestRoute />
                </AuthGuard>
              }
              path="/protected"
            />
          </Routes>
        </Router>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/protected/i));
    await waitFor(() => {
      expect(container).toContainHTML('You are on the test page');
    });
  });
});
