import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { InfiniteScrollModule } from '../infinite-scroll/infinite-scroll.module';
import { LazyImageModule } from '../lazy-image/lazy-image.module';
import { RatingModule } from '../rating/rating.module';
import { BooksListComponent } from './books-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InfiniteScrollModule,
    MatCardModule,
    RatingModule,
    LazyImageModule,
  ],
  declarations: [BooksListComponent],
  exports: [BooksListComponent],
})
export class BooksListModule {}
