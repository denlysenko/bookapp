import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';

import { Book } from '@bookapp/shared/interfaces';

import { InfiniteScrollComponent } from '../infinite-scroll/infinite-scroll.component';
import { LazyImageDirective } from '../lazy-image/lazy-image.directive';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'bookapp-books-list',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    CurrencyPipe,
    InfiniteScrollComponent,
    RatingComponent,
    LazyImageDirective,
  ],
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksListComponent {
  readonly books = input.required<Book[]>();
  readonly hasMoreItems = input<boolean>();

  readonly bookRated = output<{ bookId: string; rate: number }>();
  readonly loadMore = output<void>();

  handleScrollChange() {
    if (!this.hasMoreItems) {
      return;
    }

    this.loadMore.emit();
  }
}
