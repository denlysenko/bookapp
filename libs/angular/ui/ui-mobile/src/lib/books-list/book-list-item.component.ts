import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import { Book } from '@bookapp/shared';

@Component({
  selector: 'bookapp-book-list-item',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListItemComponent implements AfterViewInit {
  @Input()
  set book(value: Book) {
    if (value) {
      this._book = value;
      if (this.ratingElemRef) {
        this.subscribeToRatingChanges();
      }
    }
  }
  get book(): Book {
    return this._book;
  }

  @ViewChild('rating', { static: false })
  ratingElemRef: ElementRef;

  @Output()
  rate = new EventEmitter<{ bookId: string; rate: number }>();

  private _book: Book;

  ngAfterViewInit() {
    this.ratingElemRef.nativeElement.value = this._book.rating;
    this.subscribeToRatingChanges();
  }

  private subscribeToRatingChanges() {
    // as books are loaded dynamically and to not emit event each time the book value changed, first off the listener
    this.ratingElemRef.nativeElement.off('valueChange');
    this.ratingElemRef.nativeElement.value = this._book.rating;
    this.ratingElemRef.nativeElement.on('valueChange', (args: any) => {
      const val = args.object.get('value');
      this.rate.emit({ bookId: this.book._id, rate: val });
    });
  }
}
