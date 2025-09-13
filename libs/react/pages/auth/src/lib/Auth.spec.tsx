import { useNavigate } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FeedbackProvider } from '@bookapp/react/ui';
import {
  GENERATE_AUTH_OPTIONS_MUTATION,
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  VERIFY_AUTHENTICATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';
import { authenticationOptions, authenticationResponse, authPayload } from '@bookapp/testing/react';

import Auth from './Auth';

jest.mock('react-router-dom');
jest.mock('@simplewebauthn/browser', () => {
  const authenticationResponse = require('@bookapp/testing/react').authenticationResponse;

  return {
    startAuthentication: jest.fn().mockResolvedValue(authenticationResponse),
  };
});

const firstName = 'First';
const lastName = 'Last';
const email = 'test@test.com';
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

const authOptions = {
  request: {
    query: GENERATE_AUTH_OPTIONS_MUTATION,
  },
  result: {
    data: {
      generateAuthenticationOptions: authenticationOptions,
    },
  },
};

const verifyAuthResponse = {
  request: {
    query: VERIFY_AUTHENTICATION_RESPONSE_MUTATION,
    variables: {
      response: authenticationResponse,
    },
  },
  result: {
    data: {
      verifyAuthenticationResponse: authPayload,
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
        expect(navigate).toHaveBeenCalledTimes(1);
      });
    });

    it('should login with passkey', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider mocks={[authOptions, verifyAuthResponse]}>
            <Auth />
          </MockedProvider>
        </FeedbackProvider>
      );

      fireEvent.click(screen.getByTestId('login-menu'));
      fireEvent.click(screen.getByText('Login with Passkey'));

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledTimes(1);
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
        expect(navigate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
