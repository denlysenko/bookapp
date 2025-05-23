import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Book } from '@bookapp/shared/interfaces';
import { book } from '@bookapp/testing/react';

import BooksList from './BooksList';

const onBookRate = jest.fn();
const onLoadMore = jest.fn();

const books = [book] as Book[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <BooksList books={books} onBookRate={onBookRate} onLoadMore={onLoadMore} />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render list items', async () => {
    const { getAllByTestId } = render(
      <MemoryRouter>
        <BooksList books={books} onBookRate={onBookRate} onLoadMore={onLoadMore} />
      </MemoryRouter>
    );
    expect(getAllByTestId('list-item')).toHaveLength(books.length);
  });

  it('should call onBookRated prop', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <BooksList books={books} onBookRate={onBookRate} onLoadMore={onLoadMore} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('3 Stars'));

    expect(onBookRate).toHaveBeenCalledTimes(1);
    expect(onBookRate).toHaveBeenCalledWith({ bookId: book.id, rate: 3 });
  });
});
