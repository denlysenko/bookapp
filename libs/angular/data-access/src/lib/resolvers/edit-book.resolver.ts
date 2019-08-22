import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Book } from '@bookapp/shared/models';
import { BOOK_FOR_EDIT_QUERY } from '@bookapp/shared/queries';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class EditBookResolver implements Resolve<Book> {
  constructor(private readonly apollo: Apollo) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Book> {
    const slug = route.paramMap.get('slug');

    return this.apollo
      .query<{ book: Book }>({
        query: BOOK_FOR_EDIT_QUERY,
        variables: {
          slug
        }
      })
      .pipe(map(res => res.data.book));
  }
}
