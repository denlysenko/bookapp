import { memo } from 'react';
import { Link } from 'react-router-dom';

import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useMe } from '@bookapp/react/data-access';
import { BOOKMARKS, ROLES } from '@bookapp/shared/enums';
import { Book, BookmarkEvent } from '@bookapp/shared/interfaces';
import { formatCurrency } from '@bookapp/utils/react';

import { StyledBookDetails } from './StyledBookDetails';

export interface BookDetailsProps {
  book: Book;
  bookmarks?: string[];
  onBookmarkAdd: (event: BookmarkEvent) => void;
  onBookmarkRemove: (event: BookmarkEvent) => void;
  onBookRate: (event: { bookId: string; rate: number }) => void;
  onPaymentRequest?: (book: Book) => void;
}

export function BookDetails({
  book,
  bookmarks = [],
  onBookmarkAdd,
  onBookmarkRemove,
  onBookRate,
  onPaymentRequest,
}: BookDetailsProps) {
  const { me } = useMe();

  const inFavorites = () => bookmarks.includes(BOOKMARKS.FAVORITES);

  const inWishlist = () => bookmarks.includes(BOOKMARKS.WISHLIST);

  const inMustread = () => bookmarks.includes(BOOKMARKS.MUSTREAD);

  const isAdmin = () => me && me.roles.includes(ROLES.ADMIN);

  const handleFavoritesClick = () => {
    inFavorites()
      ? onBookmarkRemove({
          type: BOOKMARKS.FAVORITES,
          bookId: book.id,
        })
      : onBookmarkAdd({
          type: BOOKMARKS.FAVORITES,
          bookId: book.id,
        });
  };

  const handleWishlistClick = () => {
    inWishlist()
      ? onBookmarkRemove({
          type: BOOKMARKS.WISHLIST,
          bookId: book.id,
        })
      : onBookmarkAdd({
          type: BOOKMARKS.WISHLIST,
          bookId: book.id,
        });
  };

  const handleMustreadClick = () => {
    inMustread()
      ? onBookmarkRemove({
          type: BOOKMARKS.MUSTREAD,
          bookId: book.id,
        })
      : onBookmarkAdd({
          type: BOOKMARKS.MUSTREAD,
          bookId: book.id,
        });
  };

  return (
    <StyledBookDetails>
      <div className="cover">
        <img src={book.coverUrl ? book.coverUrl : '/images/nocover.svg'} alt={book.title} />
        {book.paid && <div>{formatCurrency(book.price)}</div>}
        <Rating
          name="rating"
          value={book.rating}
          onChange={(_, value) => {
            onBookRate({ bookId: book.id, rate: value });
          }}
        />
        <div className="actions">
          {!book.paid && (
            <Link to={`/books/read/${book.url}`} data-testid="read">
              <Tooltip title="Read book">
                <IconButton color="secondary">
                  <Icon color="secondary">book</Icon>
                </IconButton>
              </Tooltip>
            </Link>
          )}
          {book.paid && (
            <Tooltip title="Buy book">
              <IconButton
                color="secondary"
                data-testid="buy"
                onClick={() => onPaymentRequest && onPaymentRequest(book)}
              >
                <Icon color="secondary">credit_card</Icon>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={inFavorites() ? 'Remove from Favorites' : 'Add To Favorites'}>
            <IconButton color="secondary" onClick={handleFavoritesClick} data-testid="favorites">
              <Icon color="secondary">{inFavorites() ? 'star' : 'star_border'}</Icon>
            </IconButton>
          </Tooltip>
          {book.paid && (
            <Tooltip title={inWishlist() ? 'Remove from Wishlist' : 'Add to Wishlist'}>
              <IconButton color="secondary" onClick={handleWishlistClick} data-testid="wishlist">
                <Icon color="secondary">{inWishlist() ? 'favorite' : 'favorite_border'}</Icon>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={inMustread() ? 'Remove from must read' : 'Add to must read'}>
            <IconButton color="secondary" onClick={handleMustreadClick} data-testid="mustread">
              <Icon color="secondary">{inMustread() ? 'bookmark' : 'bookmark_border'}</Icon>
            </IconButton>
          </Tooltip>
          {isAdmin() && (
            <Link to={`/books/add/${book.url}`} data-testid="edit">
              <Tooltip title="Edit book">
                <IconButton color="secondary">
                  <Icon color="secondary">edit</Icon>
                </IconButton>
              </Tooltip>
            </Link>
          )}
          <div className="view-num">
            <Icon>visibility</Icon>
            <span>{book.views}</span>
          </div>
        </div>
      </div>
      <div className="details">
        <Typography variant="h3" data-testid="title">
          {book.title}
        </Typography>
        <Typography variant="h4">by {book.author}</Typography>
        <div className="toolbar">{book.description || 'No Description'}</div>
      </div>
    </StyledBookDetails>
  );
}

export default memo(BookDetails);
