import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BookReaderComponent } from './components/book-reader/book-reader.component';
import { ReadBookPageComponent } from './containers/read-book-page/read-book-page.component';
import { ReadBookRoutingModule } from './read-book-routing.module';

@NgModule({
  imports: [CommonModule, ReadBookRoutingModule],
  declarations: [ReadBookPageComponent, BookReaderComponent],
})
export class ReadBookModule {}
