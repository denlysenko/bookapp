import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import { BookService } from '../services/books/book.service';

export function readBookResolver(route: ActivatedRouteSnapshot) {
  const bookService = inject(BookService);
  const authService = inject(AuthService);
  const slug = route.paramMap.get('slug');

  if (slug) {
    return combineLatest([
      bookService.fetchBook(slug),
      authService.fetchMe().pipe(map(({ data }) => data.me)),
    ]).pipe(
      map(([book, user]) => ({
        epubUrl: book.data.book.epubUrl,
        bookmark: null,
        userId: user.id,
      })),
      take(1)
    );
  }

  return authService.fetchMe().pipe(
    map(({ data }) => data.me),
    map((user) => ({
      epubUrl: user.reading.epubUrl,
      bookmark: user.reading.bookmark,
      userId: user.id,
    })),
    take(1)
  );
}
