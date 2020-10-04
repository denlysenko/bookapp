// tslint:disable: no-identical-functions
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ERRORS } from '@bookapp/shared/constants';

import PasswordForm from './PasswordForm';

const onSubmit = jest.fn();
// tslint:disable-next-line: no-hardcoded-credentials
const password = 'password';

describe('PasswordForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<PasswordForm loading={false} onSubmit={onSubmit} />);
    expect(baseElement).toBeTruthy();
  });

  describe('Validations', () => {
    describe('oldPassword', () => {
      it('should display required error', async () => {
        const { container } = render(<PasswordForm loading={false} onSubmit={onSubmit} />);

        fireEvent.change(container.querySelector('[name=password]'), {
          target: {
            value: password,
          },
        });

        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });
      });
    });

    describe('password', () => {
      it('should display required error', async () => {
        const { container } = render(<PasswordForm loading={false} onSubmit={onSubmit} />);

        fireEvent.change(container.querySelector('[name=oldPassword]'), {
          target: {
            value: password,
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
      const { container } = render(<PasswordForm loading={false} onSubmit={onSubmit} />);

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

      await waitFor(() => {
        expect(onSubmit).toBeCalledTimes(1);
      });

      expect(onSubmit).toBeCalledWith({
        oldPassword: password,
        password,
      });
    });

    it('should disable button when loading prop passed', async () => {
      render(<PasswordForm loading={true} onSubmit={onSubmit} />);
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });
  });
});
