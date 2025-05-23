import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';

import { BuyBooksPageBase } from '@bookapp/angular/base';
import { BooksService } from '@bookapp/angular/data-access';
import {
  BooksFilterComponent,
  BooksListComponent,
  PreloaderComponent,
} from '@bookapp/angular/ui-desktop';

@Component({
  imports: [
    AsyncPipe,
    MatToolbarModule,
    PreloaderComponent,
    BooksFilterComponent,
    BooksListComponent,
  ],
  templateUrl: './buy-books-page.component.html',
  styleUrls: ['./buy-books-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BooksService],
})
export class BuyBooksPageComponent extends BuyBooksPageBase {}
