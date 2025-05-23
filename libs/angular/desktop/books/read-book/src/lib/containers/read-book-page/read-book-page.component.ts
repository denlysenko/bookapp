import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ReadBookBase } from '@bookapp/angular/base';

import { BookReaderComponent } from '../../components/book-reader/book-reader.component';

@Component({
  imports: [BookReaderComponent],
  templateUrl: './read-book-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadBookPageComponent extends ReadBookBase {}
