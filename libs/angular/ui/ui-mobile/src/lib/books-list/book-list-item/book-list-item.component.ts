/* eslint-disable no-unused-private-class-members */
import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { ThemePlatformService } from '@bookapp/angular/core';

import { Book } from '@bookapp/shared/interfaces';

import { NativeScriptCommonModule, NSRouterLink } from '@nativescript/angular';
import { isIOS } from '@nativescript/core';

@Component({
  selector: 'bookapp-book-list-item',
  imports: [NativeScriptCommonModule, NSRouterLink, CurrencyPipe],
  templateUrl: './book-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class BookListItemComponent implements OnDestroy {
  readonly book = input<Book>();
  readonly ratingElemRef = viewChild<ElementRef>('rating');

  readonly rate = output<{ bookId: string; rate: number }>();

  readonly #themeService = inject(ThemePlatformService);

  readonly #bookEffect = effect(() => {
    const book = this.book();
    const ratingElemRef = this.ratingElemRef();

    if (book && ratingElemRef) {
      this.#subscribeToRatingChanges();
    }
  });

  readonly itemHeight = computed(() => {
    if (isIOS) {
      return undefined;
    }

    return this.book().paid ? 405 : 365;
  });

  readonly dark = this.#themeService.dark;

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
      this.rate.emit({ bookId: this.book().id, rate: val });
    });
  }
}
