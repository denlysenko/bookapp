import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/client/testing';

import { FeedbackProvider } from '@bookapp/react/ui';
import {
  BOOK_FOR_EDIT_QUERY,
  CREATE_BOOK_MUTATION,
  UPDATE_BOOK_MUTATION,
} from '@bookapp/shared/queries';
import { book } from '@bookapp/testing';

import AddBook, { BOOK_CREATED, BOOK_UPDATED } from './AddBook';

const slug = 'test-book';

const createBookMock = {
  request: {
    query: CREATE_BOOK_MUTATION,
    variables: {
      book: {
        title: book.title,
        author: book.author,
        description: book.description,
        paid: book.paid,
        price: book.price,
        coverUrl: null,
        epubUrl: null,
      },
    },
  },
  result: {
    data: {
      createBook: {
        _id: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        epubUrl: book.epubUrl,
        paid: book.paid,
        price: book.price,
      },
    },
  },
};

const updateBookMock = {
  request: {
    query: UPDATE_BOOK_MUTATION,
    variables: {
      id: book._id,
      book: {
        title: book.title,
        author: book.author,
        description: book.description,
        paid: book.paid,
        price: book.price,
        coverUrl: book.coverUrl,
        epubUrl: book.epubUrl,
      },
    },
  },
  result: {
    data: {
      updateBook: {
        _id: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        epubUrl: book.epubUrl,
        paid: book.paid,
        price: book.price,
      },
    },
  },
};

const bookForEditMock = {
  request: {
    query: BOOK_FOR_EDIT_QUERY,
    variables: {
      slug,
    },
  },
  result: {
    data: {
      book: {
        _id: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        coverUrl: book.coverUrl,
        epubUrl: book.epubUrl,
        paid: book.paid,
        price: book.price,
        __typename: 'Book',
      },
    },
  },
};

describe('AddBook', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FeedbackProvider>
        <MockedProvider mocks={[]}>
          <AddBook />
        </MockedProvider>
      </FeedbackProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('submitForm', () => {
    it('should create book', async () => {
      const { container } = render(
        <FeedbackProvider>
          <MockedProvider mocks={[createBookMock]}>
            <AddBook />
          </MockedProvider>
        </FeedbackProvider>
      );

      fireEvent.change(container.querySelector('[name=title]'), {
        target: {
          value: book.title,
        },
      });

      fireEvent.change(container.querySelector('[name=author]'), {
        target: {
          value: book.author,
        },
      });

      fireEvent.change(container.querySelector('[name=description]'), {
        target: {
          value: book.description,
        },
      });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      expect(await screen.findByText(BOOK_CREATED)).toBeInTheDocument();
    });

    it('should update book', async () => {
      render(
        <MockedProvider mocks={[bookForEditMock, updateBookMock]}>
          <FeedbackProvider>
            <MemoryRouter initialEntries={[`/books/add/${slug}`]}>
              <Routes>
                <Route path="/books/add/:slug" element={<AddBook />} />
              </Routes>
            </MemoryRouter>
          </FeedbackProvider>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/edit the book/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      expect(await screen.findByText(BOOK_UPDATED)).toBeInTheDocument();
    });
  });
});
