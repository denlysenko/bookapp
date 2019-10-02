import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Book } from '@bookapp/shared';

@Component({
  selector: 'bookapp-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooksListComponent {
  @Input() books: Book[];
  @Output() bookRated = new EventEmitter<{ bookId: string; rate: number }>();
}
