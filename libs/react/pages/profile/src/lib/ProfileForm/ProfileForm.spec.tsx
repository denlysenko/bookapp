import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ERRORS } from '@bookapp/shared/constants';
import { user } from '@bookapp/testing/react';

import ProfileForm from './ProfileForm';

const props = {
  user: {
    ...user,
    firstName: 'John',
    lastName: 'Doe',
  },
  loading: false,
  error: null,
  onSubmit: jest.fn(),
};

describe('ProfileForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<ProfileForm {...props} />);
    expect(baseElement).toBeTruthy();
  });

  describe('Validations', () => {
    describe('email', () => {
      it('should display required error', async () => {
        const { container } = render(<ProfileForm {...props} />);

        fireEvent.change(container.querySelector('[name=email]'), {
          target: {
            value: '',
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });

      it('should display invalid email error', async () => {
        const { container } = render(<ProfileForm {...props} />);

        fireEvent.change(container.querySelector('[name=email]'), {
          target: {
            value: 'test',
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.INVALID_EMAIL)).toBeInTheDocument();
        });
      });
    });

    describe('firstName', () => {
      it('should display required error', async () => {
        const { container } = render(<ProfileForm {...props} />);

        fireEvent.change(container.querySelector('[name=firstName]'), {
          target: {
            value: '',
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });
    });

    describe('lastName', () => {
      it('should display required error', async () => {
        const { container } = render(<ProfileForm {...props} />);

        fireEvent.change(container.querySelector('[name=lastName]'), {
          target: {
            value: '',
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Submitting', () => {
    it('should call onSubmit prop', async () => {
      render(<ProfileForm {...props} />);

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(props.onSubmit).toBeCalledTimes(1);
      });

      expect(props.onSubmit).toBeCalledWith({
        email: props.user.email,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
      });
    });

    it('should disable button when loading prop passed', async () => {
      render(<ProfileForm {...props} loading={true} />);
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });
  });

  describe('API Errors', () => {
    it('should display API errors and not submit', async () => {
      const errorMessage = 'Error message';
      const error = {
        email: {
          path: 'email',
          message: errorMessage,
        },
      };
      render(<ProfileForm {...props} error={error} />);
      expect(screen.queryByText(errorMessage)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(props.onSubmit).toBeCalledTimes(0);
      });
    });
  });
});
