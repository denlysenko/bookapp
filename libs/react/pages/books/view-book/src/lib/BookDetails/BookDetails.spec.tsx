import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';

import { BOOKMARKS } from '@bookapp/shared/enums';
import { ME_QUERY } from '@bookapp/shared/queries';
import { book, userWithTypename } from '@bookapp/testing/react';

import BookDetails from './BookDetails';

const onBookmarkAdd = jest.fn();
const onBookmarkRemove = jest.fn();
const onBookRate = jest.fn();

const userMock = {
  request: {
    query: ME_QUERY,
  },
  result: {
    data: {
      me: userWithTypename,
    },
  },
};

describe('BookDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider mocks={[userMock]}>
        <MemoryRouter>
          <BookDetails
            book={book}
            onBookmarkAdd={onBookmarkAdd}
            onBookmarkRemove={onBookmarkRemove}
            onBookRate={onBookRate}
          />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  describe('Links', () => {
    it('should display read link and not display buy link', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: false }}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('read')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('buy')).not.toBeInTheDocument();
    });

    it('should display buy link and not display read link', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: true }}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('read')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('buy')).toBeInTheDocument();
    });

    it('should not display edit link', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={book}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('edit')).not.toBeInTheDocument();
      });
    });

    it('should display edit link', async () => {
      const adminMock = {
        request: {
          query: ME_QUERY,
        },
        result: {
          data: {
            me: { ...userWithTypename, roles: ['admin'] },
          },
        },
      };

      render(
        <MockedProvider mocks={[adminMock]}>
          <MemoryRouter>
            <BookDetails
              book={book}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('edit')).toBeInTheDocument();
      });
    });
  });

  describe('handleFavoritesClick', () => {
    it('should call onBookmarkRemove', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: false }}
              bookmarks={[BOOKMARKS.FAVORITES]}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('favorites')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('favorites'));

      expect(onBookmarkRemove).toHaveBeenCalledTimes(1);
      expect(onBookmarkRemove).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        bookId: book.id,
      });
    });

    it('should call onBookmarkAdd', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: false }}
              bookmarks={[]}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('favorites')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('favorites'));

      expect(onBookmarkAdd).toHaveBeenCalledTimes(1);
      expect(onBookmarkAdd).toHaveBeenCalledWith({
        type: BOOKMARKS.FAVORITES,
        bookId: book.id,
      });
    });
  });

  describe('handleWishlistClick', () => {
    it('should call onBookmarkRemove', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: true }}
              bookmarks={[BOOKMARKS.WISHLIST]}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('wishlist')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('wishlist'));

      expect(onBookmarkRemove).toHaveBeenCalledTimes(1);
      expect(onBookmarkRemove).toHaveBeenCalledWith({
        type: BOOKMARKS.WISHLIST,
        bookId: book.id,
      });
    });

    it('should call onBookmarkAdd', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: true }}
              bookmarks={[]}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('wishlist')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('wishlist'));

      expect(onBookmarkAdd).toHaveBeenCalledTimes(1);
      expect(onBookmarkAdd).toHaveBeenCalledWith({
        type: BOOKMARKS.WISHLIST,
        bookId: book.id,
      });
    });
  });

  describe('handleMustreadClick', () => {
    it('should call onBookmarkRemove', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: false }}
              bookmarks={[BOOKMARKS.MUSTREAD]}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('mustread')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('mustread'));

      expect(onBookmarkRemove).toHaveBeenCalledTimes(1);
      expect(onBookmarkRemove).toHaveBeenCalledWith({
        type: BOOKMARKS.MUSTREAD,
        bookId: book.id,
      });
    });

    it('should call onBookmarkAdd', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: false }}
              bookmarks={[]}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('mustread')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('mustread'));

      expect(onBookmarkAdd).toHaveBeenCalledTimes(1);
      expect(onBookmarkAdd).toHaveBeenCalledWith({
        type: BOOKMARKS.MUSTREAD,
        bookId: book.id,
      });
    });
  });

  describe('onBookRate', () => {
    it('should call onBookRate', async () => {
      render(
        <MockedProvider mocks={[userMock]}>
          <MemoryRouter>
            <BookDetails
              book={{ ...book, paid: false }}
              bookmarks={[]}
              onBookmarkAdd={onBookmarkAdd}
              onBookmarkRemove={onBookmarkRemove}
              onBookRate={onBookRate}
            />
          </MemoryRouter>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('favorites')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('3 Stars'));

      expect(onBookRate).toHaveBeenCalledTimes(1);
      expect(onBookRate).toHaveBeenCalledWith({ bookId: book.id, rate: 3 });
    });
  });
});
