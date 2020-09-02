import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Book } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListComponent {
  @Input() books: Book[];
  @Input() hasMoreItems: boolean;

  @Output() bookRated = new EventEmitter<{ bookId: string; rate: number }>();
  @Output() loadMore = new EventEmitter<void>();

  handleScrollChange() {
    if (!this.hasMoreItems) {
      return;
    }

    this.loadMore.emit();
  }
}
