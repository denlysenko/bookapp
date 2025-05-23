import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';

import { InMemoryCache } from '@apollo/client/core';
import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';
import { ME_QUERY } from '@bookapp/shared/queries';
import { user } from '@bookapp/testing/react';

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

    const { container } = render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={['/test']}>
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>root</div>} path="/" />
            <Route element={<div>auth</div>} path="/auth" />
            <Route element={<div>test</div>} path="/test" />
            <Route
              element={
                <RolesGuard roles={['user']}>
                  <TestRoute />
                </RolesGuard>
              }
              path="/protected"
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(container).toContainHTML('test');
    fireEvent.click(screen.getByText(/protected/i));
    expect(container).toContainHTML('auth');
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

    const { container } = render(
      <MockedProvider mocks={[]} cache={cache}>
        <MemoryRouter initialEntries={['/test']}>
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>test</div>} path="/test" />
            <Route element={<div>root</div>} path="/" />
            <Route
              element={
                <RolesGuard roles={['admin']}>
                  <TestRoute />
                </RolesGuard>
              }
              path="/protected"
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(container).toContainHTML('test');
    fireEvent.click(screen.getByText(/protected/i));
    expect(container).toContainHTML('root');
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
            <Route element={<div>root</div>} path="/" />
            <Route
              element={
                <RolesGuard roles={['admin']}>
                  <TestRoute />
                </RolesGuard>
              }
              path="/protected"
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(container).toContainHTML('test');
    fireEvent.click(screen.getByText(/protected/i));
    expect(container).toContainHTML('You are on the test page');
  });
});
