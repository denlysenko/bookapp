import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Book } from '@bookapp/shared/interfaces';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BookService } from '../services/books/book.service';

@Injectable()
export class EditBookResolver implements Resolve<Book> {
  constructor(private readonly bookService: BookService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Book> {
    const slug = route.paramMap.get('slug');

    return this.bookService.fetchBookForEdit(slug).pipe(map((res) => res.data.book));
  }
}
