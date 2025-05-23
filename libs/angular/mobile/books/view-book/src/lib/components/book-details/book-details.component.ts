/* eslint-disable no-unused-private-class-members */
import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  viewChild,
} from '@angular/core';

import { BookDetailsBase } from '@bookapp/angular/base';

import { NativeScriptCommonModule, NSRouterLink } from '@nativescript/angular';

@Component({
  selector: 'bookapp-book-details',
  imports: [NativeScriptCommonModule, NSRouterLink, CurrencyPipe],
  templateUrl: './book-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class BookDetailsComponent extends BookDetailsBase implements OnDestroy {
  readonly ratingElemRef = viewChild<ElementRef>('rating');

  readonly #bookEffect = effect(() => {
    const book = this.book();
    const ratingElemRef = this.ratingElemRef();

    if (book && ratingElemRef) {
      this.#subscribeToRatingChanges();
    }
  });

  ngOnDestroy() {
    if (this.ratingElemRef()) {
      this.ratingElemRef().nativeElement.off('valueChange');
    }
  }

  #subscribeToRatingChanges() {
    // as books are loaded dynamically and to not emit event each time the book value changed, first off the listener
    this.ratingElemRef().nativeElement.off('valueChange');
    this.ratingElemRef().nativeElement.value = this.book().rating;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ratingElemRef().nativeElement.on('valueChange', (args: any) => {
      const val = args.object.get('value');
      this.rate(val);
    });
  }
}
