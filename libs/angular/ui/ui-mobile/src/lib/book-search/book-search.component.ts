import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  signal,
} from '@angular/core';

import { BaseComponent } from '@bookapp/angular/base';
import { ThemePlatformService } from '@bookapp/angular/core';
import { BooksService } from '@bookapp/angular/data-access';
import { Book } from '@bookapp/shared/interfaces';

import { ModalDialogParams, NativeScriptCommonModule } from '@nativescript/angular';
import { Color, isIOS, ObservableArray, SearchBar } from '@nativescript/core';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';

const SEARCH_FIELD = 'title';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const UIColor: any;

@Component({
  selector: 'bookapp-book-search',
  imports: [NativeScriptCommonModule],
  templateUrl: './book-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class BookSearchComponent extends BaseComponent implements OnInit {
  readonly #params = inject(ModalDialogParams);
  readonly #booksService = inject(BooksService);
  readonly #themeService = inject(ThemePlatformService);

  readonly #searchText$ = new Subject<string>();

  readonly books = signal<ObservableArray<Book> | null>(null);

  ngOnInit() {
    this.#searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchValue) =>
          this.#booksService.getBooks(this.#params.context.paid, {
            field: SEARCH_FIELD,
            search: searchValue,
          })
        ),
        map(({ data: { books } }) => books.rows),
        takeUntil(this.destroy$)
      )
      .subscribe((books) => this.books.set(new ObservableArray<Book>(books)));
  }

  onSearchLoaded(args: { object: SearchBar }) {
    const sb = args.object;

    sb.textFieldHintColor = new Color(this.#themeService.dark() ? '#e5e5e5' : '#737373');

    if (isIOS) {
      sb.ios.backgroundColor = UIColor.whiteColor;
      sb.ios.showsCancelButton = true;
      sb.focus();
    }
  }

  onClear() {
    this.#params.closeCallback(null);
  }

  onTextChanged(args: { object: SearchBar }) {
    const searchValue = args.object.text;
    this.#searchText$.next(searchValue);
  }

  onItemSelect({ index }) {
    this.#params.closeCallback(this.books().getItem(index));
  }

  onSubmit() {
    this.#params.closeCallback(null);
  }
}
