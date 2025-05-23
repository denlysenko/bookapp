import { slugify } from '@bookapp/utils/api';

import { Schema } from 'mongoose';

import { BOOK_VALIDATION_ERRORS } from '../constants';
import { BookModel } from '../interfaces/book';

export const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, BOOK_VALIDATION_ERRORS.TITLE_REQUIRED_ERR],
      trim: true,
    },
    author: {
      type: String,
      required: [true, BOOK_VALIDATION_ERRORS.AUTHOR_REQUIRED_ERR],
      trim: true,
    },
    coverUrl: String,
    epubUrl: String,
    description: String,
    slug: String,
    total_rating: {
      type: Number,
      default: 0,
    },
    total_rates: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// makes slug for book before saving
BookSchema.pre<BookModel>('save', async function () {
  this.slug = slugify(this.title);
});

BookSchema.virtual('url').get(function () {
  return `${slugify(this.author)}/${this.slug}`;
});

// to access virtual property from Angular
BookSchema.set('toJSON', { virtuals: true });
