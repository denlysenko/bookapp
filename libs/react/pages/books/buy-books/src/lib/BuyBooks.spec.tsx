import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';
import { DEFAULT_SORT_VALUE } from '@bookapp/react/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { PAID_BOOKS_QUERY } from '@bookapp/shared/queries';
import { book } from '@bookapp/testing/react';

import BuyBooks from './BuyBooks';

jest.mock('lodash', () => ({
  debounce: jest.fn((fn) => fn),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).IntersectionObserver = jest.fn(() => ({
  observe: () => null,
  disconnect: () => null,
}));

const b = {
  id: book.id,
  title: book.title,
  author: book.author,
  coverUrl: book.coverUrl,
  url: book.url,
  rating: book.rating,
  total_rates: book.total_rates,
  total_rating: book.total_rating,
  paid: book.paid,
  __typename: 'Book',
};

const mock = {
  request: {
    query: PAID_BOOKS_QUERY,
    variables: {
      paid: true,
      filter: {
        field: 'title',
        search: '',
      },
      skip: 0,
      first: DEFAULT_LIMIT,
      orderBy: DEFAULT_SORT_VALUE,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  },
  result: {
    data: {
      books: {
        rows: [b],
        count: 1,
        __typename: 'BooksResponse',
      },
    },
  },
};

describe('BuyBooks', () => {
  beforeEach(() => {
    jest.spyOn(store, 'get').mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={[mock]}>
        <BuyBooks />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should get and render books', async () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <MockedProvider mocks={[mock]}>
          <BuyBooks />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllByTestId('list-item')).toHaveLength(1);
    });
  });

  describe('onSearch()', () => {
    it('should search and render books', async () => {
      const searchTerm = 'test';
      const searchMock = {
        request: {
          query: PAID_BOOKS_QUERY,
          variables: {
            paid: true,
            filter: {
              field: 'title',
              search: searchTerm,
            },
            skip: 0,
            first: DEFAULT_LIMIT,
            orderBy: DEFAULT_SORT_VALUE,
          },
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true,
        },
        result: {
          data: {
            books: {
              rows: [b],
              count: 1,
              __typename: 'BooksResponse',
            },
          },
        },
      };

      const { container, getAllByTestId } = render(
        <MemoryRouter>
          <MockedProvider mocks={[mock, searchMock]}>
            <BuyBooks />
          </MockedProvider>
        </MemoryRouter>
      );

      fireEvent.change(container.querySelector('[data-testid=search] input'), {
        target: {
          value: searchTerm,
        },
      });

      await waitFor(() => {
        expect(getAllByTestId('list-item')).toHaveLength(1);
      });
    });
  });

  describe('onSort()', () => {
    it('should sort and render books', async () => {
      const orderBy = 'views_desc';
      const sortMock = {
        request: {
          query: PAID_BOOKS_QUERY,
          variables: {
            paid: true,
            filter: {
              field: 'title',
              search: '',
            },
            skip: 0,
            first: DEFAULT_LIMIT,
            orderBy,
          },
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true,
        },
        result: {
          data: {
            books: {
              rows: [b],
              count: 1,
              __typename: 'BooksResponse',
            },
          },
        },
      };

      const { getAllByTestId } = render(
        <MemoryRouter>
          <MockedProvider mocks={[mock, sortMock]}>
            <BuyBooks />
          </MockedProvider>
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('popular'));

      await waitFor(() => {
        expect(getAllByTestId('list-item')).toHaveLength(1);
      });
    });
  });
});
