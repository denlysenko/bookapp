import { comment } from './comment';

export const book = {
  _id: 'book_id',
  title: 'Book Title',
  author: 'Book Author',
  coverUrl: 'uploads/cover.png',
  epubUrl: 'uploads/book.epub',
  description: 'Book description',
  slug: 'book-title',
  url: 'book-author/book-title',
  total_rating: 10,
  total_rates: 20,
  rating: 4,
  views: 20,
  paid: false,
  price: null,
  comments: [comment],
  createdAt: 1563132857195,
  updatedAt: 1563132857195,
};
