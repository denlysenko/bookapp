// tslint:disable: max-union-size

export interface BooksFilter {
  searchQuery: string;
  sortValue:
    | 'title_asc'
    | 'title_desc'
    | 'author_asc'
    | 'author_desc'
    | 'rating_asc'
    | 'rating_desc'
    | 'views_asc'
    | 'views_desc'
    | 'createdAt_asc'
    | 'createdAt_desc';
}

export interface BooksFilterInput {
  field?: string;
  search?: string;
}
