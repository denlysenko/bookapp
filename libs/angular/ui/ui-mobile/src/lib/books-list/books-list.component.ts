/* eslint-disable no-unused-private-class-members */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  NO_ERRORS_SCHEMA,
  output,
  viewChild,
} from '@angular/core';

import { Book } from '@bookapp/shared/interfaces';

import { NativeScriptCommonModule } from '@nativescript/angular';
import { ObservableArray } from '@nativescript/core';

import { ListViewLoadOnDemandMode } from 'nativescript-ui-listview';
import {
  NativeScriptUIListViewModule,
  RadListViewComponent,
} from 'nativescript-ui-listview/angular';

import { BookListItemComponent } from './book-list-item/book-list-item.component';

@Component({
  selector: 'bookapp-books-list',
  imports: [NativeScriptCommonModule, NativeScriptUIListViewModule, BookListItemComponent],
  templateUrl: './books-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class BooksListComponent {
  readonly books = input<Book[]>();
  readonly hasMoreItems = input<boolean>();

  readonly loadMore = output<void>();
  readonly rate = output<{ bookId: string; rate: number }>();

  readonly listViewComponent = viewChild<RadListViewComponent>('listView');

  readonly #booksEffect = effect(() => {
    const books = this.books();

    if (!books) {
      return;
    }

    /* RadListView throws an exception on Android:
     * JS: ERROR TypeError: Cannot read property 'notifyLoadingFinished' of null
     * and causes app crashes
     * this might be fixed in next versions
     * for now use try/catch
     */
    try {
      this.listViewComponent()?.listView.notifyLoadOnDemandFinished();
    } catch {
      //
    }
  });

  readonly #hasMoreItemsEffect = effect(() => {
    const hasMoreItems = this.hasMoreItems();

    if (this.listViewComponent()) {
      this.listViewComponent().listView.loadOnDemandMode =
        ListViewLoadOnDemandMode[hasMoreItems ? 'Auto' : 'None'];
    }
  });

  readonly _books = computed(() => {
    const books = this.books();

    if (!books) {
      return null;
    }

    return new ObservableArray(books);
  });

  readonly itemHeight = computed(() => {
    const books = this.books();

    if (!books || books.length === 0) {
      return 365;
    }

    const hasPaidBooks = books.some((book) => book.paid);

    return hasPaidBooks ? 390 : 365;
  });

  scrollToIndex(index: number) {
    this.listViewComponent()?.listView.scrollToIndex(index);
  }
}
