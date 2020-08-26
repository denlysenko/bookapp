import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthFacade } from '../services/auth/auth.facade';
import { BooksService } from '../services/books/books.service';

@Injectable()
export class ReadBookResolver
  implements Resolve<{ epubUrl: string; bookmark: string; userId: string }> {
  constructor(
    private readonly booksService: BooksService,
    private readonly authFacade: AuthFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const slug = route.paramMap.get('slug');

    if (slug) {
      return combineLatest([
        this.booksService.getBook(slug).valueChanges,
        this.authFacade.me().pipe(map(({ data }) => data.me)),
      ]).pipe(
        map(([book, user]) => ({
          epubUrl: book.data.book.epubUrl,
          bookmark: null,
          userId: user._id,
        })),
        take(1)
      );
    }

    return this.authFacade.me().pipe(
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
