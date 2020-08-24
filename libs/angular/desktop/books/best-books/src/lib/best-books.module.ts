import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BooksListModule, PreloaderModule } from '@bookapp/angular/ui-desktop';

import { BestBooksRoutingModule } from './best-books-routing.module';
import { BestBooksPageComponent } from './containers/best-books-page/best-books-page.component';

@NgModule({
  imports: [
    CommonModule,
    BestBooksRoutingModule,
    MatToolbarModule,
    PreloaderModule,
    BooksListModule,
  ],
  declarations: [BestBooksPageComponent],
})
export class BestBooksModule {}
