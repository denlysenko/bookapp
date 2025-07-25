import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';

import { DEFAULT_LIMIT } from '@bookapp/shared/constants';
import { BOOKMARKS } from '@bookapp/shared/enums';
import { BOOKMARKS_QUERY, RATE_BOOK_MUTATION } from '@bookapp/shared/queries';
import { book } from '@bookapp/testing/react';

import Bookmarks from './Bookmarks';

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
  price: 0,
  __typename: 'Book',
};

const mock = {
  request: {
    query: BOOKMARKS_QUERY,
    variables: {
      type: BOOKMARKS.FAVORITES,
      skip: 0,
      first: DEFAULT_LIMIT,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  },
  result: {
    data: {
      bookmarks: {
        rows: [
          {
            type: BOOKMARKS.FAVORITES,
            book: b,
            __typename: 'Bookmark',
          },
        ],
        count: 1,
        __typename: 'BookmarksResponse',
      },
    },
  },
};

const rateBookMock = {
  request: {
    query: RATE_BOOK_MUTATION,
    variables: {
      rate: 3,
      bookId: book.id,
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

const title = 'Favourite books';

describe('Bookmarks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={[mock]}>
        <Bookmarks title={title} type={BOOKMARKS.FAVORITES} />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should get and render bookmarks and title', async () => {
    const { getAllByTestId, getByText } = render(
      <MemoryRouter>
        <MockedProvider mocks={[mock]}>
          <Bookmarks title={title} type={BOOKMARKS.FAVORITES} />
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getAllByTestId('list-item')).toHaveLength(1);
    });

    expect(getByText(title)).toBeInTheDocument();
  });

  describe('Rate book', () => {
    it('should rate book', async () => {
      const { container, getByText, getAllByTestId } = render(
        <MemoryRouter>
          <MockedProvider mocks={[mock, mock, rateBookMock]}>
            <Bookmarks title={title} type={BOOKMARKS.FAVORITES} />
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
