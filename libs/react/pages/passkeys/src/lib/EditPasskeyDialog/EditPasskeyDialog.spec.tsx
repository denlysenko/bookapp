import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ERRORS } from '@bookapp/shared/constants';

import EditPasskeyDialog from './EditPasskeyDialog';

const onClose = jest.fn();
const mockLabel = 'My Passkey';

describe('EditPasskeyDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <EditPasskeyDialog open={true} label={mockLabel} onClose={onClose} />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should not render when open is false', () => {
    render(<EditPasskeyDialog open={false} label={mockLabel} onClose={onClose} />);
    expect(screen.queryByText('Edit passkey')).not.toBeInTheDocument();
  });

  describe('Initial Values', () => {
    it('should display initial label value in input field', () => {
      render(<EditPasskeyDialog open={true} label={mockLabel} onClose={onClose} />);

      const labelInput = screen.getByLabelText(/label/i) as HTMLInputElement;
      expect(labelInput.value).toBe(mockLabel);
    });

    it('should display empty string when label is not provided', () => {
      render(<EditPasskeyDialog open={true} label="" onClose={onClose} />);

      const labelInput = screen.getByLabelText(/label/i) as HTMLInputElement;
      expect(labelInput.value).toBe('');
    });
  });

  describe('Validation', () => {
    it('should display required error when label is empty', async () => {
      render(<EditPasskeyDialog open={true} label={mockLabel} onClose={onClose} />);

      const labelInput = screen.getByLabelText(/label/i);

      fireEvent.change(labelInput, {
        target: { value: '' },
      });

      fireEvent.click(screen.getByTestId('save'));

      await waitFor(() => {
        expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
      });
    });

    it('should not display error when label is provided', async () => {
      render(<EditPasskeyDialog open={true} label="" onClose={onClose} />);

      const labelInput = screen.getByLabelText(/label/i);

      fireEvent.change(labelInput, {
        target: { value: 'Valid Label' },
      });

      fireEvent.click(screen.getByTestId('save'));

      await waitFor(() => {
        expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).not.toBeInTheDocument();
      });
    });
  });

  describe('Close', () => {
    it('should call onClose when cancel button is clicked', () => {
      render(<EditPasskeyDialog open={true} label={mockLabel} onClose={onClose} />);

      fireEvent.click(screen.getByTestId('cancel'));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledWith();
    });
  });

  describe('Submission', () => {
    describe('Valid Form', () => {
      it('should call onClose with new label value when form is valid', async () => {
        render(<EditPasskeyDialog open={true} label={mockLabel} onClose={onClose} />);

        const labelInput = screen.getByLabelText(/label/i);
        const newLabel = 'Updated Passkey Label';

        fireEvent.change(labelInput, {
          target: { value: newLabel },
        });

        fireEvent.click(screen.getByTestId('save'));

        await waitFor(() => {
          expect(onClose).toHaveBeenCalledTimes(1);
        });

        expect(onClose).toHaveBeenCalledWith(newLabel);
      });

      it('should call onClose with original label when no changes made', async () => {
        render(<EditPasskeyDialog open={true} label={mockLabel} onClose={onClose} />);

        fireEvent.click(screen.getByTestId('save'));

        await waitFor(() => {
          expect(onClose).toHaveBeenCalledTimes(1);
        });

        expect(onClose).toHaveBeenCalledWith(mockLabel);
      });
    });

    describe('Invalid Form', () => {
      it('should not call onClose when form is invalid (empty label)', async () => {
        render(<EditPasskeyDialog open={true} label={mockLabel} onClose={onClose} />);

        const labelInput = screen.getByLabelText(/label/i);

        fireEvent.change(labelInput, {
          target: { value: '' },
        });

        fireEvent.click(screen.getByTestId('save'));

        await waitFor(() => {
          expect(screen.queryByText(ERRORS.REQUIRED_FIELD)).toBeInTheDocument();
        });

        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });
});
