import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BooksFilterModule, BooksListModule, PreloaderModule } from '@bookapp/angular/ui-desktop';

import { BrowseBooksPageComponent } from './containers/browse-books-page/browse-books-page.component';

@NgModule({
  imports: [CommonModule, MatToolbarModule, PreloaderModule, BooksFilterModule, BooksListModule],
  declarations: [BrowseBooksPageComponent]
})
export class BrowseBooksModule {}
