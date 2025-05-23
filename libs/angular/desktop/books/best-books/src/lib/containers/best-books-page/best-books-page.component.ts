import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';

import { BestBooksBase } from '@bookapp/angular/base';
import { BooksListComponent, PreloaderComponent } from '@bookapp/angular/ui-desktop';

@Component({
  imports: [AsyncPipe, MatToolbarModule, PreloaderComponent, BooksListComponent],
  templateUrl: './best-books-page.component.html',
  styleUrls: ['./best-books-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BestBooksPageComponent extends BestBooksBase {}
