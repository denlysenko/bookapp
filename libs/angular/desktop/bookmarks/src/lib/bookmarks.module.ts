import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BooksListModule, PreloaderModule } from '@bookapp/angular/ui-desktop';

import { BookmarksRoutingModule } from './bookmarks-routing.module';
import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';

@NgModule({
  imports: [
    CommonModule,
    BookmarksRoutingModule,
    MatToolbarModule,
    PreloaderModule,
    BooksListModule
  ],
  declarations: [BookmarksPageComponent]
})
export class BookmarksModule {}
