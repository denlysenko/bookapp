import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowseBooksRoutingModule } from './browse-books-routing.module';
import { BrowseBooksPageComponent } from './containers/browse-books-page/browse-books-page.component';

@NgModule({
  imports: [CommonModule, BrowseBooksRoutingModule],
  declarations: [BrowseBooksPageComponent]
})
export class BrowseBooksModule {}
