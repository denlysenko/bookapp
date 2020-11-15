import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';

import { Book } from '@bookapp/shared/interfaces';
import { book } from '@bookapp/testing';

import BooksList from './BooksList';

const onBookRate = jest.fn();
const onLoadMore = jest.fn();

const books: Book[] = [book];

(window as any).IntersectionObserver = jest.fn(() => ({
  observe: () => null,
  disconnect: () => null,
}));

describe('BooksList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <BooksList
          books={books}
          hasMoreItems={false}
          onBookRate={onBookRate}
          onLoadMore={onLoadMore}
        />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render list items', async () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <BooksList
          books={books}
          hasMoreItems={false}
          onBookRate={onBookRate}
          onLoadMore={onLoadMore}
        />
      </MemoryRouter>
    );
    expect(getAllByTestId('list-item')).toHaveLength(books.length);
  });

  it('should call onBookRated prop', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <BooksList
          books={books}
          hasMoreItems={false}
          onBookRate={onBookRate}
          onLoadMore={onLoadMore}
        />
      </MemoryRouter>
    );

    fireEvent.click(getByText('3 Stars'));

    expect(onBookRate).toHaveBeenCalledTimes(1);
    expect(onBookRate).toHaveBeenCalledWith({ bookId: book._id, rate: 3 });
  });
});
