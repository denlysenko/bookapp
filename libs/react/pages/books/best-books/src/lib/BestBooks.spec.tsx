import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/client/testing';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { BEST_BOOKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';
import { book } from '@bookapp/testing';

import BestBooks from './BestBooks';

(window as any).IntersectionObserver = jest.fn(() => ({
  observe: () => null,
  disconnect: () => null,
}));

const b = {
  _id: book._id,
  title: book.title,
  author: book.author,
  coverUrl: book.coverUrl,
  url: book.url,
  rating: book.rating,
  total_rates: book.total_rates,
  total_rating: book.total_rating,
  paid: book.paid,
  price: 0,
  __typename: 'Book',
};

const mock = {
  request: {
    query: BEST_BOOKS_QUERY,
    variables: {
      skip: 0,
      first: DEFAULT_LIMIT,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  },
  result: {
    data: {
      bestBooks: {
        rows: [
          {
            ...b,
            __typename: 'Book',
          },
        ],
        count: 1,
        __typename: 'BooksResponse',
      },
    },
  },
};

const rateBookMock = {
  request: {
    query: RATE_BOOK_MUTATION,
    variables: {
      rate: 3,
      bookId: book._id,
    },
  },
  result: {
    data: {
      rateBook: {
        rating: 3,
        total_rates: book.total_rates + 1,
        total_rating: book.total_rating + 1,
        __typename: 'Book',
      },
    },
  },
};

describe('BestBooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={[mock]}>
        <BestBooks />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should get and render best books', async () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <MockedProvider mocks={[mock]}>
          <BestBooks />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllByTestId('list-item')).toHaveLength(1);
    });
  });

  describe('Rate book', () => {
    it('should rate book', async () => {
      const { container, getByText, getAllByTestId } = render(
        <MemoryRouter>
          <MockedProvider mocks={[mock, mock, rateBookMock]}>
            <BestBooks />
          </MockedProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(getAllByTestId('list-item')).toHaveLength(1);
      });

      fireEvent.click(getByText('3 Stars'));

      await waitFor(() => {
        expect(container.querySelectorAll('.MuiRating-iconFilled')).toHaveLength(3);
      });
    });
  });
});
