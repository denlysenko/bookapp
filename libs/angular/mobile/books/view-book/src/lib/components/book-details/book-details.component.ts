import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { BookDetailsBase } from '@bookapp/angular/base';
import { Book } from '@bookapp/shared';

@Component({
  moduleId: module.id,
  selector: 'bookapp-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookDetailsComponent extends BookDetailsBase implements OnDestroy {
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

  private _book: Book;

  @ViewChild('rating', { static: true })
  ratingElemRef: ElementRef;

  ngOnDestroy() {
    if (this.ratingElemRef) {
      this.ratingElemRef.nativeElement.off('valueChange');
    }
  }

  private subscribeToRatingChanges() {
    // as books are loaded dynamically and to not emit event each time the book value changed, first off the listener
    this.ratingElemRef.nativeElement.off('valueChange');
    this.ratingElemRef.nativeElement.value = this.book.rating;
    this.ratingElemRef.nativeElement.on('valueChange', (args: any) => {
      const val = args.object.get('value');
      this.rate(val);
    });
  }
}
