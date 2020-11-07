import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ERRORS } from '@bookapp/shared/constants';
import { book } from '@bookapp/testing';

import AddBookForm from './AddBookForm';

const props = {
  book,
  loading: false,
  error: null,
  onSubmit: jest.fn(),
};

// tslint:disable: no-duplicate-string

// tslint:disable: no-identical-functions
describe('AddBookForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<AddBookForm {...props} />);
    expect(baseElement).toBeTruthy();
  });

  describe('Validations', () => {
    describe('title', () => {
      it('should display required error', async () => {
        const { container } = render(<AddBookForm {...props} />);

        fireEvent.change(container.querySelector('[name=title]'), {
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

    describe('author', () => {
      it('should display required error', async () => {
        const { container } = render(<AddBookForm {...props} />);

        fireEvent.change(container.querySelector('[name=author]'), {
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

    describe('description', () => {
      it('should display required error', async () => {
        const { container } = render(<AddBookForm {...props} />);

        fireEvent.change(container.querySelector('[name=description]'), {
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

    describe('paid', () => {
      it('should display required error', async () => {
        const { container } = render(<AddBookForm {...props} />);

        fireEvent.click(screen.getByLabelText(/paid/i));

        fireEvent.change(container.querySelector('[name=price]'), {
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

  describe('Change Cover', () => {
    it('should open ImageSelector', async () => {
      render(<AddBookForm {...props} />);
      fireEvent.click(screen.getByRole('button', { name: /change cover/i }));
      await waitFor(() => {
        expect(screen.getByText(/select file/i)).toBeInTheDocument();
      });
    });
  });

  describe('Change Epub', () => {
    it('should open FileSelector', async () => {
      render(<AddBookForm {...props} />);
      fireEvent.click(screen.getByRole('button', { name: /change epub/i }));
      await waitFor(() => {
        expect(screen.getByText(/select file/i)).toBeInTheDocument();
      });
    });

    it('should display download link', async () => {
      const propsWithEpub = {
        ...props,
        book: {
          ...props.book,
          epubUrl: 'test',
        },
      };

      render(<AddBookForm {...propsWithEpub} />);
      expect(screen.getByText(/download/i)).toBeInTheDocument();
    });
  });

  describe('Submitting', () => {
    it('should call onSubmit prop', async () => {
      render(<AddBookForm {...props} />);

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(props.onSubmit).toBeCalledTimes(1);
      });

      expect(props.onSubmit).toBeCalledWith({
        title: props.book.title,
        author: props.book.author,
        description: props.book.description,
        coverUrl: props.book.coverUrl,
        epubUrl: props.book.epubUrl,
        paid: props.book.paid,
        price: props.book.price,
      });
    });

    it('should disable button when loading prop passed', async () => {
      render(<AddBookForm {...props} loading={true} />);
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });
  });

  describe('API Errors', () => {
    it('should display API errors and not submit', async () => {
      const errorMessage = 'Error message';
      const error = {
        title: {
          path: 'title',
          message: errorMessage,
        },
      };
      render(<AddBookForm {...props} error={error} />);
      expect(screen.queryByText(errorMessage)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(props.onSubmit).toBeCalledTimes(0);
      });
    });
  });
});
