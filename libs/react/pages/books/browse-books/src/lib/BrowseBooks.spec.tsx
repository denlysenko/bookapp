import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/client/testing';

import { store } from '@bookapp/react/core';
import { DEFAULT_SORT_VALUE } from '@bookapp/react/data-access';
import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { FREE_BOOKS_QUERY } from '@bookapp/shared/queries';
import { book } from '@bookapp/testing';

import BrowseBooks from './BrowseBooks';

jest.mock('lodash', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...jest.requireActual<any>('lodash'),
  debounce: jest.fn((fn) => fn),
}));

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
  __typename: 'Book',
};

// tslint:disable: no-duplicate-string
const mock = {
  request: {
    query: FREE_BOOKS_QUERY,
    variables: {
      paid: false,
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

describe('BrowseBooks', () => {
  beforeEach(() => {
    jest.spyOn(store, 'get').mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={[mock]}>
        <BrowseBooks />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should get and render books', async () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <MockedProvider mocks={[mock]}>
          <BrowseBooks />
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
          query: FREE_BOOKS_QUERY,
          variables: {
            paid: false,
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
            <BrowseBooks />
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
          query: FREE_BOOKS_QUERY,
          variables: {
            paid: false,
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
            <BrowseBooks />
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
