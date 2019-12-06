import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import { BooksService } from '../services/books/books.service';

@Injectable()
export class ReadBookResolver
  implements Resolve<{ epubUrl: string; bookmark: string; userId: string }> {
  constructor(
    private readonly booksService: BooksService,
    private readonly authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const slug = route.paramMap.get('slug');

    if (slug) {
      return combineLatest([
        this.booksService.getBook(slug).valueChanges,
        this.authService.me().valueChanges
      ]).pipe(
        map(([book, user]) => ({
          epubUrl: book.data.book.epubUrl,
          bookmark: null,
          userId: user.data.me._id
        })),
        take(1)
      );
    }

    return this.authService.me().valueChanges.pipe(
      map(({ data: { me } }) => ({
        epubUrl: me.reading.epubUrl,
        bookmark: me.reading.bookmark,
        userId: me._id
      })),
      take(1)
    );
  }
}
