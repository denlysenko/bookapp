import { Comment } from './comment';

export interface Book {
  _id: any;
  title: string;
  author: string;
  coverUrl: string;
  epubUrl: string;
  description: string;
  slug: string;
  url: string;
  total_rating: number;
  total_rates: number;
  rating: number;
  views: number;
  paid: boolean;
  price: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BookFormModel {
  title: string;
  author: string;
  coverUrl: string;
  epubUrl: string;
  description: string;
  paid: boolean;
}

export interface RateBookResponse {
  rateBook: Book;
}
