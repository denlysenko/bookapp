import { MockedProvider } from '@apollo/client/testing';
import * as simpleWebAuthn from '@simplewebauthn/browser';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FeedbackProvider } from '@bookapp/react/ui';
import {
  DELETE_PASSKEY_MUTATION,
  GENERATE_REGISTRATION_OPTIONS_MUTATION,
  GET_PASSKEYS_QUERY,
  UPDATE_PASSKEY_MUTATION,
  VERIFY_REGISTRATION_RESPONSE_MUTATION,
} from '@bookapp/shared/queries';
import { authenticationOptions, passkey, registrationResponse } from '@bookapp/testing/react';

import { GraphQLError } from 'graphql';

import Passkeys from './Passkeys';

jest.mock('@simplewebauthn/browser', () => ({
  ...jest.requireActual('@simplewebauthn/browser'),
  browserSupportsWebAuthn: jest.fn(() => true),
  startRegistration: jest.fn(),
}));

const mockPasskeysResponse = {
  count: 2,
  rows: [
    {
      ...passkey,
      id: '1',
      label: 'Test Passkey 1',
      deviceType: 'platform',
      backedUp: true,
      aaguid: 'test-aaguid-1',
      lastUsedAt: 1640000000,
    },
    {
      ...passkey,
      id: '2',
      label: 'Test Passkey 2',
      deviceType: 'cross-platform',
      backedUp: false,
      aaguid: 'test-aaguid-2',
      lastUsedAt: 1640000001,
    },
  ],
};

const errorMessage = 'Something went wrong';
const updatedLabel = 'Updated Passkey Label';

const getPasskeysSuccess = {
  request: {
    query: GET_PASSKEYS_QUERY,
  },
  result: {
    data: {
      passkeys: mockPasskeysResponse,
    },
  },
};

const updatePasskeySuccess = {
  request: {
    query: UPDATE_PASSKEY_MUTATION,
    variables: {
      id: '1',
      label: updatedLabel,
    },
  },
  result: {
    data: {
      updatePasskey: {
        ...mockPasskeysResponse.rows[0],
        label: updatedLabel,
      },
    },
  },
};

const updatePasskeyError = {
  request: {
    query: UPDATE_PASSKEY_MUTATION,
    variables: {
      id: '1',
      label: updatedLabel,
    },
  },
  result: {
    errors: [new GraphQLError(errorMessage)],
  },
};

const deletePasskeySuccess = {
  request: {
    query: DELETE_PASSKEY_MUTATION,
    variables: {
      id: '1',
    },
  },
  result: {
    data: {
      deletePasskey: true,
    },
  },
};

const deletePasskeyError = {
  request: {
    query: DELETE_PASSKEY_MUTATION,
    variables: {
      id: '1',
    },
  },
  result: {
    errors: [new GraphQLError(errorMessage)],
  },
};

const generateRegistrationOptionsSuccess = {
  request: {
    query: GENERATE_REGISTRATION_OPTIONS_MUTATION,
  },
  result: {
    data: {
      generateRegistrationOptions: authenticationOptions,
    },
  },
};

const generateRegistrationOptionsError = {
  request: {
    query: GENERATE_REGISTRATION_OPTIONS_MUTATION,
  },
  result: {
    errors: [new GraphQLError(errorMessage)],
  },
};

const verifyRegistrationResponseSuccess = {
  request: {
    query: VERIFY_REGISTRATION_RESPONSE_MUTATION,
    variables: {
      response: registrationResponse,
    },
  },
  result: {
    data: {
      verifyRegistrationResponse: {
        ...passkey,
        id: '3',
        label: 'New Passkey',
        deviceType: 'platform',
        backedUp: true,
        aaguid: 'new-aaguid',
        lastUsedAt: 1640000002,
      },
    },
  },
};

const verifyRegistrationResponseError = {
  request: {
    query: VERIFY_REGISTRATION_RESPONSE_MUTATION,
    variables: {
      response: registrationResponse,
    },
  },
  result: {
    errors: [new GraphQLError(errorMessage)],
  },
};

const mockFetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        'test-aaguid-1': {
          name: 'Test Device 1',
          icon_light: 'icon1.png',
          icon_dark: 'icon1-dark.png',
        },
      }),
  })
);
global.fetch = mockFetch as jest.Mock;

describe('Passkeys', () => {
  beforeEach(() => {
    (simpleWebAuthn.startRegistration as jest.Mock).mockResolvedValue(registrationResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <FeedbackProvider>
        <MockedProvider mocks={[getPasskeysSuccess]}>
          <Passkeys />
        </MockedProvider>
      </FeedbackProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should show message when browser does not support passkeys', () => {
    (simpleWebAuthn.browserSupportsWebAuthn as jest.Mock).mockReturnValueOnce(false);

    render(
      <FeedbackProvider>
        <MockedProvider mocks={[getPasskeysSuccess]}>
          <Passkeys />
        </MockedProvider>
      </FeedbackProvider>
    );

    expect(screen.getByText('Your browser does not support passkeys.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument();
  });

  it('should render passkeys when supported', async () => {
    render(
      <FeedbackProvider>
        <MockedProvider mocks={[getPasskeysSuccess]}>
          <Passkeys />
        </MockedProvider>
      </FeedbackProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Passkey 1')).toBeInTheDocument();
      expect(screen.getByText('Test Passkey 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });
  });

  it('should fetch and handle aaguids metadata', async () => {
    render(
      <FeedbackProvider>
        <MockedProvider mocks={[getPasskeysSuccess]}>
          <Passkeys />
        </MockedProvider>
      </FeedbackProvider>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/aaguids.json');
    });
  });

  it('should handle metadata fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(
      <FeedbackProvider>
        <MockedProvider mocks={[getPasskeysSuccess]}>
          <Passkeys />
        </MockedProvider>
      </FeedbackProvider>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/aaguids.json');
    });

    await waitFor(() => {
      expect(screen.getByText('Test Passkey 1')).toBeInTheDocument();
    });
  });

  describe('addPasskey', () => {
    it('should add passkey successfully', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider
            mocks={[
              getPasskeysSuccess,
              generateRegistrationOptionsSuccess,
              verifyRegistrationResponseSuccess,
            ]}
          >
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /add/i }));

      expect(await screen.findByText('Passkey created')).toBeInTheDocument();
    });

    it('should show error when registration options generation fails', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider
            mocks={[getPasskeysSuccess, generateRegistrationOptionsError]}
            defaultOptions={{
              mutate: {
                errorPolicy: 'all',
              },
            }}
          >
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /add/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });

    it('should show error when registration verification fails', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider
            mocks={[
              getPasskeysSuccess,
              generateRegistrationOptionsSuccess,
              verifyRegistrationResponseError,
            ]}
            defaultOptions={{
              mutate: {
                errorPolicy: 'all',
              },
            }}
          >
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /add/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });

    it('should show error when WebAuthn registration fails', async () => {
      const webAuthnError = new Error('WebAuthn registration failed');
      (simpleWebAuthn.startRegistration as jest.Mock).mockRejectedValue(webAuthnError);

      render(
        <FeedbackProvider>
          <MockedProvider mocks={[getPasskeysSuccess, generateRegistrationOptionsSuccess]}>
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /add/i }));

      expect(await screen.findByText('Error adding passkey')).toBeInTheDocument();
    });
  });

  describe('editPasskey', () => {
    it('should update passkey successfully', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider mocks={[getPasskeysSuccess, updatePasskeySuccess]}>
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Passkey 1')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTestId('edit');
      fireEvent.click(editButtons[0]);

      const labelInput = screen.getByLabelText(/label/i);
      fireEvent.change(labelInput, { target: { value: updatedLabel } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(await screen.findByText('Passkey updated')).toBeInTheDocument();
    });

    it('should show error when update fails', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider
            mocks={[getPasskeysSuccess, updatePasskeyError]}
            defaultOptions={{
              mutate: {
                errorPolicy: 'all',
              },
            }}
          >
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Passkey 1')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByTestId('edit');
      fireEvent.click(editButtons[0]);

      const labelInput = screen.getByLabelText(/label/i);
      fireEvent.change(labelInput, { target: { value: updatedLabel } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('deletePasskey', () => {
    it('should delete passkey successfully', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider mocks={[getPasskeysSuccess, deletePasskeySuccess]}>
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Passkey 1')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId('delete');
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText(/are you sure you want to delete passkey/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      expect(await screen.findByText('Passkey deleted')).toBeInTheDocument();
    });

    it('should show error when delete fails', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider
            mocks={[getPasskeysSuccess, deletePasskeyError]}
            defaultOptions={{
              mutate: {
                errorPolicy: 'all',
              },
            }}
          >
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Passkey 1')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId('delete');
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText(/are you sure you want to delete passkey/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });

    it('should not delete passkey when canceled', async () => {
      render(
        <FeedbackProvider>
          <MockedProvider mocks={[getPasskeysSuccess]}>
            <Passkeys />
          </MockedProvider>
        </FeedbackProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Passkey 1')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId('delete');
      fireEvent.click(deleteButtons[0]);

      expect(screen.getByText(/are you sure you want to delete passkey/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      await waitFor(() => {
        expect(
          screen.queryByText(/are you sure you want to delete passkey/i)
        ).not.toBeInTheDocument();
      });
    });
  });
});
