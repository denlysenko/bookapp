import React from 'react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';

import { AnonymousGuard } from './AnonymousGuard';

const TestRoute = () => <h1>You are on the test page</h1>;

describe('AnonymousGuard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to home page', () => {
    jest.spyOn(store, 'get').mockReturnValue('token');

    render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={['/test']}>
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>test</div>} path="/test" />
            <AnonymousGuard element={<TestRoute />} path="/protected" />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/protected/i));

    expect(window.location.pathname).toBe('/');
  });

  it('should render', () => {
    jest.spyOn(store, 'get').mockReturnValue(undefined);

    const { container } = render(
      <MockedProvider mocks={[]}>
        <MemoryRouter initialEntries={['/test']}>
          <Link to="/protected">Protected</Link>
          <Routes>
            <Route element={<div>test</div>} path="/test" />
            <AnonymousGuard element={<TestRoute />} path="/protected" />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/protected/i));

    expect(container).toContainHTML('You are on the test page');
  });
});
