import React from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import Rating from '@material-ui/lab/Rating';

import { Book } from '@bookapp/shared/interfaces';

import { InfiniteScroll } from '../InfiniteScroll';
import { LazyImage } from '../LazyImage';
import { useBooksListStyles } from './useBooksListStyles';

export interface BooksListProps {
  books: Book[];
  onBookRate: ({ bookId: string, rate: number }) => void;
  onLoadMore: () => void;
}

export const BooksList = ({ books = [], onBookRate, onLoadMore }: BooksListProps) => {
  const classes = useBooksListStyles();

  return (
    <div className={classes.root}>
      <InfiniteScroll onLoadMore={onLoadMore}>
        {books.map((book) => (
          <div key={book._id} className="list-item-wrapper" data-testid="list-item">
            <Card className="list-item">
              <div className="cover">
                <Link to={book.paid ? '/books/buy/' + book.url : '/books/browse/' + book.url}>
                  <LazyImage
                    src={book.coverUrl}
                    placeholder="/assets/images/nocover.svg"
                    alt={book.title}
                  />
                </Link>
              </div>
              <Link
                className="title"
                to={book.paid ? '/books/buy/' + book.url : '/books/browse/' + book.url}
              >
                {book.title}
              </Link>
              <span className="author">by {book.author}</span>
              {book.paid && <div>{book.price}</div>}
              <Rating
                name="rating"
                value={book.rating}
                // tslint:disable-next-line: jsx-no-lambda
                onChange={(_, value) => {
                  onBookRate({ bookId: book._id, rate: value });
                }}
              />
            </Card>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default BooksList;
