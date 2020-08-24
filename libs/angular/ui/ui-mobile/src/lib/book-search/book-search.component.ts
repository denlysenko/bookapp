import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BaseComponent } from '@bookapp/angular/base';
import { BooksService } from '@bookapp/angular/data-access';
import { Book } from '@bookapp/shared';

import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';

import * as application from 'tns-core-modules/application';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';
import { SearchBar } from 'tns-core-modules/ui/search-bar';

const SEARCH_FIELD = 'title';

@Component({
  moduleId: module.id,
  selector: 'bookapp-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookSearchComponent extends BaseComponent implements OnInit {
  private searchText$ = new Subject<string>();
  private books = new BehaviorSubject<ObservableArray<Book> | null>(null);

  constructor(
    private readonly params: ModalDialogParams,
    private readonly booksService: BooksService
  ) {
    super();
  }

  get books$() {
    return this.books.asObservable();
  }

  ngOnInit() {
    this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(
          (searchValue) =>
            this.booksService.getBooks(this.params.context.paid, {
              field: SEARCH_FIELD,
              search: searchValue,
            }).valueChanges
        ),
        map(({ data: { books } }) => books.rows),
        takeUntil(this.destroy$)
      )
      .subscribe((books) => this.books.next(new ObservableArray<Book>(books)));
  }

  onSearchLoaded(args: any) {
    const sb = args.object as SearchBar;

    if (application.ios) {
      sb.focus();
      sb.ios.showsCancelButton = true;
    }
  }

  onClear() {
    this.params.closeCallback(null);
  }

  onTextChanged(args: any) {
    const searchValue = args.object.text;
    this.searchText$.next(searchValue);
  }

  onItemSelect({ index }) {
    this.params.closeCallback(this.books.getValue().getItem(index));
  }

  onSubmit() {
    this.params.closeCallback(null);
  }
}
