import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { Book } from '@bookapp/shared/interfaces';

import { ListViewLoadOnDemandMode } from 'nativescript-ui-listview';
import { RadListViewComponent } from 'nativescript-ui-listview/angular';

import { BehaviorSubject } from 'rxjs';

import { Color, ObservableArray, isIOS } from '@nativescript/core';

@Component({
  moduleId: module.id,
  selector: 'bookapp-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListComponent {
  @Input()
  set books(books: Book[]) {
    if (books) {
      this._books.next(new ObservableArray(books));
    }
  }

  @Input()
  set hasMoreItems(hasMoreItems: boolean) {
    this.listViewComponent.listView.loadOnDemandMode =
      ListViewLoadOnDemandMode[hasMoreItems ? 'Auto' : 'None'];

    /* RadListView throws an exception on Android:
     * JS: ERROR TypeError: Cannot read property 'notifyLoadingFinished' of null
     * and causes app crashes
     * this might be fixed in next versions
     * for now use try/catch
     */
    try {
      this.listViewComponent.listView.notifyLoadOnDemandFinished();
    } catch (e) {}
  }

  @Output()
  loadMore = new EventEmitter<void>();

  @Output()
  rate = new EventEmitter<{ bookId: string; rate: number }>();

  @ViewChild('listView', { static: true })
  listViewComponent: RadListViewComponent;

  private _books = new BehaviorSubject<ObservableArray<Book> | null>(null);

  get books$() {
    return this._books.asObservable();
  }

  onItemLoading(args: any) {
    if (isIOS) {
      const newcolor = new Color('#eeeeee');
      args.ios.backgroundView.backgroundColor = newcolor.ios;
    }
  }

  scrollToIndex(index: number) {
    this.listViewComponent.listView.scrollToIndex(index);
  }
}
