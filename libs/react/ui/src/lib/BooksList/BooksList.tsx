import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import Rating from '@mui/material/Rating';

import { Book } from '@bookapp/shared/interfaces';
import { formatCurrency } from '@bookapp/utils/react';

import { InfiniteScroll } from '../InfiniteScroll';
import { LazyImage } from '../LazyImage';
import { StyledBooksList } from './StyledBooksList';

export interface BooksListProps {
  books: Book[];
  onBookRate: (output: { bookId: string; rate: number }) => void;
  onLoadMore: () => void;
}

export const BooksList = ({ books = [], onBookRate, onLoadMore }: BooksListProps) => {
  return (
    <StyledBooksList>
      <InfiniteScroll onLoadMore={onLoadMore}>
        {books.map((book) => (
          <div key={book.id} className="list-item-wrapper" data-testid="list-item">
            <Card className="list-item">
              <div className="cover">
                <Link
                  to={
                    book.paid
                      ? `/books/buy/${book.url}?bookId=${book.id}`
                      : `/books/browse/${book.url}?bookId=${book.id}`
                  }
                >
                  <LazyImage
                    src={book.coverUrl ?? '/images/nocover.svg'}
                    placeholder="/images/nocover.svg"
                    alt={book.title}
                  />
                </Link>
              </div>
              <Link
                className="title"
                to={
                  book.paid
                    ? `/books/buy/${book.url}?bookId=${book.id}`
                    : `/books/browse/${book.url}?bookId=${book.id}`
                }
              >
                {book.title}
              </Link>
              <span className="author">by {book.author}</span>
              {book.paid && <div>{formatCurrency(book.price)}</div>}
              <Rating
                name="rating"
                value={book.rating}
                onChange={(_, value) => {
                  onBookRate({ bookId: book.id, rate: value });
                }}
              />
            </Card>
          </div>
        ))}
      </InfiniteScroll>
    </StyledBooksList>
  );
};

export default BooksList;
