import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FeedbackProvider } from '@bookapp/react/ui';
import { ERRORS } from '@bookapp/shared/constants';

import AuthForm from './AuthForm';

const props = {
  loading: false,
  error: null,
  onSubmit: jest.fn(),
  onLoginWithPasskey: jest.fn(),
};

const email = 'test@test.com';
const password = 'password';

describe('AuthForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Login', () => {
    it('should render login form', () => {
      const { baseElement } = render(
        <FeedbackProvider>
          <AuthForm {...props} />
        </FeedbackProvider>
      );
      expect(baseElement).toBeDefined();
      expect(screen.getByTestId('title')).toContainHTML('Login into account');
    });

    it('should have Login label on submit button', () => {
      render(
        <FeedbackProvider>
          <AuthForm {...props} />
        </FeedbackProvider>
      );
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should show error message when error prop passed', async () => {
      const { container, rerender } = render(
        <FeedbackProvider>
          <AuthForm {...props} />
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

      const errorMessage = 'Error message';

      rerender(
        <FeedbackProvider>
          <AuthForm {...props} error={{ message: errorMessage }} />
        </FeedbackProvider>
      );

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Register', () => {
    it('should render register form', () => {
      const { baseElement } = render(
        <FeedbackProvider>
          <AuthForm {...props} />
        </FeedbackProvider>
      );
      expect(baseElement).toBeDefined();
      fireEvent.click(screen.getByRole('button', { name: /create one/i }));
      expect(screen.getByTestId('title')).toContainHTML('Create account');
    });

    it('should have Create label on submit button', () => {
      render(
        <FeedbackProvider>
          <AuthForm {...props} />
        </FeedbackProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: /create one/i }));
      expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    });

    it('should show error messages when error prop passed and hide when input values were changed', async () => {
      const emailErrorMessage = 'Email error';
      const passwordErrorMessage = 'Password error';

      const error = {
        email: { path: 'email', message: emailErrorMessage },
        password: { path: 'password', message: passwordErrorMessage },
      };

      const { container, rerender } = render(
        <FeedbackProvider>
          <AuthForm {...props} />
        </FeedbackProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: /create one/i }));

      rerender(
        <FeedbackProvider>
          <AuthForm {...props} error={error} />
        </FeedbackProvider>
      );

      expect(screen.getByText(emailErrorMessage)).toBeInTheDocument();
      expect(screen.getByText(passwordErrorMessage)).toBeInTheDocument();

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

      await waitFor(() => expect(screen.queryByText(emailErrorMessage)).not.toBeInTheDocument());

      expect(screen.queryByText(passwordErrorMessage)).not.toBeInTheDocument();
    });
  });

  describe('Validations', () => {
    describe('email', () => {
      it('should display required error', async () => {
        const { container } = render(
          <FeedbackProvider>
            <AuthForm {...props} />
          </FeedbackProvider>
        );

        fireEvent.change(container.querySelector('[name=password]'), {
          target: {
            value: password,
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });

      it('should display invalid email error', async () => {
        const { container } = render(
          <FeedbackProvider>
            <AuthForm {...props} />
          </FeedbackProvider>
        );

        fireEvent.change(container.querySelector('[name=email]'), {
          target: {
            value: 'test',
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.INVALID_EMAIL)).toBeInTheDocument();
        });
      });
    });

    describe('password', () => {
      it('should display required error', async () => {
        const { container } = render(
          <FeedbackProvider>
            <AuthForm {...props} />
          </FeedbackProvider>
        );

        fireEvent.change(container.querySelector('[name=email]'), {
          target: {
            value: email,
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });
    });

    it('should reset errors when isLogginIn has changed', async () => {
      const { container } = render(
        <FeedbackProvider>
          <AuthForm {...props} />
        </FeedbackProvider>
      );

      fireEvent.change(container.querySelector('[name=email]'), {
        target: {
          value: 'test',
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.queryByText(ERRORS.INVALID_EMAIL)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /create one/i }));

      expect(screen.queryByText(ERRORS.INVALID_EMAIL)).not.toBeInTheDocument();
    });

    describe('firstName', () => {
      it('should display required error', async () => {
        const { container } = render(
          <FeedbackProvider>
            <AuthForm {...props} />
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

        fireEvent.change(container.querySelector('[name=lastName]'), {
          target: {
            value: 'last name',
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /create/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });
    });

    describe('lastName', () => {
      it('should display required error', async () => {
        const { container } = render(
          <FeedbackProvider>
            <AuthForm {...props} />
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
            value: 'first name',
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /create/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Submitting', () => {
    it('should call onSubmit prop', async () => {
      const { container } = render(
        <FeedbackProvider>
          <AuthForm {...props} />
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
        expect(props.onSubmit).toHaveBeenCalledTimes(1);
      });

      expect(props.onSubmit).toHaveBeenCalledWith(true, {
        email,
        password,
      });
    });

    it('should disable button when loading prop passed', async () => {
      render(
        <FeedbackProvider>
          <AuthForm {...props} loading={true} />
        </FeedbackProvider>
      );
      expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
    });

    it('should call onLoginWithPasskey prop', async () => {
      render(
        <FeedbackProvider>
          <AuthForm {...props} />
        </FeedbackProvider>
      );

      fireEvent.click(screen.getByTestId('login-menu'));
      fireEvent.click(screen.getByText('Login with Passkey'));

      expect(props.onLoginWithPasskey).toHaveBeenCalledTimes(1);
    });
  });
});
