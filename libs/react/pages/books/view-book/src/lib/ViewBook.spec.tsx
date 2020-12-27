import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { InMemoryCache } from '@apollo/client/core';
import { MockedProvider } from '@apollo/client/testing';

import { BOOKMARKS } from '@bookapp/shared/enums';
import {
  ADD_COMMENT_MUTATION,
  ADD_TO_BOOKMARKS_MUTATION,
  BOOKMARKS_BY_USER_AND_BOOK_QUERY,
  BOOK_QUERY,
  ME_QUERY,
  RATE_BOOK_MUTATION,
  REMOVE_FROM_BOOKMARKS_MUTATION,
} from '@bookapp/shared/queries';
import { book, user } from '@bookapp/testing';

import ViewBook from './ViewBook';

const b = { ...book };
delete b.createdAt;
delete b.updatedAt;

const slug = 'test-book';
const author = 'test-author';
const comment = 'this is a new comment';

const bookMock = {
  request: {
    query: BOOK_QUERY,
    variables: {
      slug,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  },
  result: {
    data: {
      book: {
        ...b,
        comments: [
          {
            _id: book.comments[0]._id,
            text: book.comments[0].text,
            createdAt: book.comments[0].createdAt,
            author: {
              displayName: book.comments[0].author.displayName,
              __typename: 'User',
            },
            __typename: 'Comment',
          },
        ],
        __typename: 'Book',
      },
    },
  },
};

const bookmarksMock = {
  request: {
    query: BOOKMARKS_BY_USER_AND_BOOK_QUERY,
    variables: {
      bookId: book._id,
    },
  },
  result: {
    data: {
      userBookmarksByBook: [
        {
          type: BOOKMARKS.FAVORITES,
          __typename: 'Bookmark',
        },
      ],
    },
  },
};

const addToBookmarksMock = {
  request: {
    query: ADD_TO_BOOKMARKS_MUTATION,
    variables: {
      type: BOOKMARKS.MUSTREAD,
      bookId: book._id,
    },
  },
  result: {
    data: {
      addToBookmarks: {
        type: BOOKMARKS.MUSTREAD,
        __typename: 'Bookmark',
      },
    },
  },
};

const removeFromBookmarksMock = {
  request: {
    query: REMOVE_FROM_BOOKMARKS_MUTATION,
    variables: {
      type: BOOKMARKS.FAVORITES,
      bookId: book._id,
    },
  },
  result: {
    data: {
      removeFromBookmarks: {
        type: BOOKMARKS.FAVORITES,
        __typename: 'Bookmark',
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

const submitCommentMock = {
  request: {
    query: ADD_COMMENT_MUTATION,
    variables: {
      text: comment,
      bookId: book._id,
    },
  },
  result: {
    data: {
      addComment: {
        _id: `${book.comments[0]._id}123`,
        text: comment,
        createdAt: book.comments[0].createdAt,
        author: {
          displayName: book.comments[0].author.displayName,
          __typename: 'User',
        },
        __typename: 'Comment',
      },
    },
  },
};

function renderWithRouter(additionalMocks = []) {
  const cache = new InMemoryCache();
  cache.writeQuery({
    query: ME_QUERY,
    data: {
      me: { ...user, __typename: 'User' },
    },
  });

  return render(
    <MockedProvider cache={cache} mocks={[bookMock, bookmarksMock, ...additionalMocks]}>
      <MemoryRouter initialEntries={[`/books/browse/${author}/${slug}?bookId=${book._id}`]}>
        <Routes>
          <Route path="/books/browse/:author/:slug" element={<ViewBook />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );
}

describe('ViewBook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = renderWithRouter();
    expect(baseElement).toBeTruthy();
  });

  it('should get and render book with comments', async () => {
    const { getByTestId, getAllByTestId } = renderWithRouter();

    await waitFor(() => {
      expect(getByTestId('title')).toHaveTextContent(book.title);
    });

    expect(getAllByTestId('comment')).toHaveLength(book.comments.length);
  });

  describe('Adding to bookmarks', () => {
    it('should add to bookmarks', async () => {
      const { getByTestId } = renderWithRouter([addToBookmarksMock]);

      await waitFor(() => {
        expect(getByTestId('mustread')).toHaveTextContent('bookmark_border');
      });

      fireEvent.click(getByTestId('mustread'));

      await waitFor(() => {
        expect(getByTestId('mustread')).toHaveTextContent('bookmark');
      });
    });
  });

  describe('Removing to bookmarks', () => {
    it('should remove from bookmarks', async () => {
      const { getByTestId } = renderWithRouter([removeFromBookmarksMock]);

      await waitFor(() => {
        expect(getByTestId('favorites')).toHaveTextContent('star');
      });

      fireEvent.click(getByTestId('favorites'));

      await waitFor(() => {
        expect(getByTestId('favorites')).toHaveTextContent('star_border');
      });
    });
  });

  describe('Rating book', () => {
    it('should rate book', async () => {
      const { container, getByTestId, getByText } = renderWithRouter([rateBookMock, bookMock]);

      await waitFor(() => {
        expect(getByTestId('favorites')).toHaveTextContent('star');
      });

      fireEvent.click(getByText('3 Stars'));

      await waitFor(() => {
        expect(container.querySelectorAll('.MuiRating-iconFilled')).toHaveLength(3);
      });
    });
  });

  describe('Submitting comment', () => {
    it('should submit comment', async () => {
      const { getByPlaceholderText, getByTestId, getAllByTestId } = renderWithRouter([
        submitCommentMock,
        bookMock,
      ]);

      await waitFor(() => {
        expect(getByTestId('favorites')).toHaveTextContent('star');
      });

      fireEvent.change(getByPlaceholderText('Write a short comment...'), {
        target: {
          value: comment,
        },
      });

      fireEvent.click(getByTestId('submit-comment'));

      await waitFor(() => {
        expect(getAllByTestId('comment')).toHaveLength(book.comments.length + 1);
      });
    });
  });
});
