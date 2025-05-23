import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';

import { storage, store } from '@bookapp/react/core';
import { LOGOUT_MUTATION, ME_QUERY } from '@bookapp/shared/queries';
import { userWithTypename } from '@bookapp/testing/react';

import Header from './Header';

jest.mock('react-router-dom');

const refreshToken = 'refreshToken';

const userMock = {
  request: {
    query: ME_QUERY,
  },
  result: {
    data: {
      me: userWithTypename,
    },
  },
};

const logoutMock = {
  request: {
    query: LOGOUT_MUTATION,
    variables: {
      refreshToken,
    },
  },
  result: {
    data: {
      logout: true,
    },
  },
};

const toggleDrawer = jest.fn();

describe('Header', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={[userMock]}>
        <Header toggleDrawer={toggleDrawer} />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display user info', async () => {
    const { baseElement } = render(
      <MockedProvider mocks={[userMock]}>
        <Header toggleDrawer={toggleDrawer} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(baseElement).toContainHTML(userWithTypename.displayName);
    });
  });

  describe('toggleDrawer', () => {
    it('should call toggleDrawer prop', () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <Header toggleDrawer={toggleDrawer} />
        </MockedProvider>
      );

      fireEvent.click(screen.getByTestId('toggle-menu'));
      expect(toggleDrawer).toBeCalledTimes(1);
    });
  });

  describe('logout', () => {
    const navigate = jest.fn();

    beforeEach(() => {
      jest.spyOn(storage, 'getItem').mockReturnValue(refreshToken);
      jest.spyOn(storage, 'removeItem');
      jest.spyOn(store, 'remove');
      (useNavigate as jest.MockedFunction<typeof useNavigate>).mockReturnValue(navigate);
    });

    it('should navigate to auth', async () => {
      const { baseElement } = render(
        <MockedProvider mocks={[userMock, logoutMock]}>
          <Header toggleDrawer={toggleDrawer} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(baseElement).toContainHTML(userWithTypename.displayName);
      });

      fireEvent.click(screen.getByText(userWithTypename.displayName));
      fireEvent.click(screen.getByText(/signout/i));

      await waitFor(() => {
        expect(navigate).toBeCalledTimes(1);
      });
    });
  });
});
