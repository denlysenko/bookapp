import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { map } from 'rxjs/operators';

import { BookService } from '../services/books/book.service';

export function editBookResolver(route: ActivatedRouteSnapshot) {
  const bookService = inject(BookService);
  const slug = route.paramMap.get('slug');

  return bookService.fetchBookForEdit(slug).pipe(map((res) => res.data.book));
}
