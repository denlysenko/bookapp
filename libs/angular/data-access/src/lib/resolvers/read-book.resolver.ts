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
        this.authService.fetchMe().pipe(map(({ data }) => data.me)),
      ]).pipe(
        map(([book, user]) => ({
          epubUrl: book.data.book.epubUrl,
          bookmark: null,
          userId: user._id,
        })),
        take(1)
      );
    }

    return this.authService.fetchMe().pipe(
      map(({ data }) => data.me),
      map((user) => ({
        epubUrl: user.reading.epubUrl,
        bookmark: user.reading.bookmark,
        userId: user._id,
      })),
      take(1)
    );
  }
}
