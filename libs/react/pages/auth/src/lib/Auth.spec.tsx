import React from 'react';
import { useNavigate } from 'react-router-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { FeedbackProvider } from '@bookapp/react/ui';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '@bookapp/shared/queries';
import { authPayload } from '@bookapp/testing';

import Auth from './Auth';

jest.mock('react-router-dom');

const firstName = 'First';
const lastName = 'Last';
const email = 'test@test.com';
// tslint:disable-next-line: no-hardcoded-credentials
const password = 'password';

const loginSuccess = {
  request: {
    query: LOGIN_MUTATION,
    variables: {
      email,
      password,
    },
  },
  result: {
    data: {
      login: authPayload,
    },
  },
};

const signupSuccess = {
  request: {
    query: SIGNUP_MUTATION,
    variables: {
      user: {
        firstName,
        lastName,
        email,
        password,
      },
    },
  },
  result: {
    data: {
      signup: authPayload,
    },
  },
};

describe('Auth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <FeedbackProvider>
        <MockedProvider mocks={[]}>
          <Auth />
        </MockedProvider>
      </FeedbackProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('submitForm()', () => {
    const navigate = jest.fn();

    beforeEach(() => {
      (useNavigate as jest.MockedFunction<typeof useNavigate>).mockReturnValue(navigate);
    });

    it('should login', async () => {
      const { container } = render(
        <FeedbackProvider>
          <MockedProvider mocks={[loginSuccess]}>
            <Auth />
          </MockedProvider>
        </FeedbackProvider>
      );

      fireEvent.change(container.querySelector('[name=email]'), {
        target: {
          value: email,
        },
      });

      fireEvent.change(container.querySelector('[name=password]'), {
        target: {
          value: password,
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(navigate).toBeCalledTimes(1);
      });
    });

    it('should signup', async () => {
      const { container } = render(
        <FeedbackProvider>
          <MockedProvider mocks={[signupSuccess]}>
            <Auth />
          </MockedProvider>
        </FeedbackProvider>
      );

      fireEvent.click(screen.getByRole('button', { name: /create one/i }));

      fireEvent.change(container.querySelector('[name=email]'), {
        target: {
          value: email,
        },
      });

      fireEvent.change(container.querySelector('[name=password]'), {
        target: {
          value: password,
        },
      });

      fireEvent.change(container.querySelector('[name=firstName]'), {
        target: {
          value: firstName,
        },
      });

      fireEvent.change(container.querySelector('[name=lastName]'), {
        target: {
          value: lastName,
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /create/i }));

      await waitFor(() => {
        expect(navigate).toBeCalledTimes(1);
      });
    });
  });
});
