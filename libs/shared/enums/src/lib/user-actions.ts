export enum UserActions {
  BOOK_CREATED = 'BOOK_CREATED',
  BOOK_UPDATED = 'BOOK_UPDATED',
  BOOK_REMOVED = 'BOOK_REMOVED',
  BOOK_RATED = 'BOOK_RATED',
  BOOK_ADDED_TO_MUSTREAD = 'BOOK_ADDED_TO_MUSTREAD',
  BOOK_ADDED_TO_WISHLIST = 'BOOK_ADDED_TO_WISHLIST',
  BOOK_ADDED_TO_FAVORITES = 'BOOK_ADDED_TO_FAVORITES',
  BOOK_REMOVED_FROM_MUSTREAD = 'BOOK_REMOVED_FROM_MUSTREAD',
  BOOK_REMOVED_FROM_WISHLIST = 'BOOK_REMOVED_FROM_WISHLIST',
  BOOK_REMOVED_FROM_FAVORITES = 'BOOK_REMOVED_FROM_FAVORITES',
  BOOK_BOUGHT = 'BOOK_BOUGHT',
  COMMENT_ADDED = 'COMMENT_ADDED',
}

export const UserActionsDesc = {
  [UserActions.BOOK_CREATED]: 'You created a Book',
  [UserActions.BOOK_UPDATED]: 'You updated a Book',
  [UserActions.BOOK_REMOVED]: 'You removed a Book',
  [UserActions.BOOK_RATED]: 'You rated a Book',
  [UserActions.BOOK_ADDED_TO_MUSTREAD]: 'You added a Book to Must Read Titles',
  [UserActions.BOOK_ADDED_TO_WISHLIST]: 'You added a Book to Wishlist',
  [UserActions.BOOK_ADDED_TO_FAVORITES]: 'You added a Book to Favourites',
  [UserActions.BOOK_REMOVED_FROM_MUSTREAD]: 'You removed a Book from Must Read Titles',
  [UserActions.BOOK_REMOVED_FROM_WISHLIST]: 'You removed a Book from Wishlist',
  [UserActions.BOOK_REMOVED_FROM_FAVORITES]: 'You removed a Book from Favourites',
  [UserActions.BOOK_BOUGHT]: 'You bought a Book',
  [UserActions.COMMENT_ADDED]: 'You commented a Book',
};
