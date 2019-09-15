import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Book, BOOK_QUERY, ME_QUERY, Reading, User } from '@bookapp/shared';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReadBookResolver implements Resolve<Reading> {
  constructor(private readonly apollo: Apollo) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Reading> {
    const slug = route.paramMap.get('slug');

    if (slug) {
      return this.apollo
        .query<{ book: Book }>({
          query: BOOK_QUERY,
          variables: {
            slug
          }
        })
        .pipe(
          map(({ data: { book } }) => ({
            epubUrl: book.epubUrl,
            bookmark: null
          }))
        );
    }

    return this.apollo
      .query<{ me: User }>({
        query: ME_QUERY
      })
      .pipe(map(({ data: { me } }) => me.reading));
  }
}
