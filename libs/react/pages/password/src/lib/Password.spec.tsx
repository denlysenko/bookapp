import { fireEvent, render, screen } from '@testing-library/react';

import { MockedProvider } from '@apollo/client/testing';

import { FeedbackProvider } from '@bookapp/react/ui';
import { CHANGE_PASSWORD_MUTATION } from '@bookapp/shared/queries';

import { GraphQLError } from 'graphql';

import Password, { PASSWORD_CHANGE_SUCCESS } from './Password';

const password = 'password';
const token = 'token';
const errorMessage = 'Error';

const success = {
  request: {
    query: CHANGE_PASSWORD_MUTATION,
    variables: {
      newPassword: password,
      oldPassword: password,
    },
  },
  result: {
    data: {
      changePassword: {
        accessToken: token,
        refreshToken: token,
      },
    },
  },
};

const error = {
  request: {
    query: CHANGE_PASSWORD_MUTATION,
    variables: {
      newPassword: password,
      oldPassword: password,
    },
  },
  result: {
    errors: [new GraphQLError(errorMessage)],
  },
};

describe('Password', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <FeedbackProvider>
        <MockedProvider mocks={[]}>
          <Password />
        </MockedProvider>
      </FeedbackProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('submitForm', () => {
    it('should save password', async () => {
      const { container } = render(
        <FeedbackProvider>
          <MockedProvider mocks={[success]}>
            <Password />
          </MockedProvider>
        </FeedbackProvider>
      );

      fireEvent.change(container.querySelector('[name=oldPassword]'), {
        target: {
          value: password,
        },
      });

      fireEvent.change(container.querySelector('[name=password]'), {
        target: {
          value: password,
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(await screen.findByText(PASSWORD_CHANGE_SUCCESS)).toBeInTheDocument();
    });

    it('should show error message', async () => {
      const { container } = render(
        <FeedbackProvider>
          <MockedProvider
            mocks={[error]}
            defaultOptions={{
              mutate: {
                errorPolicy: 'all',
              },
            }}
          >
            <Password />
          </MockedProvider>
        </FeedbackProvider>
      );

      fireEvent.change(container.querySelector('[name=oldPassword]'), {
        target: {
          value: password,
        },
      });

      fireEvent.change(container.querySelector('[name=password]'), {
        target: {
          value: password,
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });
});
