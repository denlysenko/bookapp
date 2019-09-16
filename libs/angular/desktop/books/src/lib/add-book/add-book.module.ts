import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AddBookRoutingModule } from './add-book.routing.module';
import { AddBookFormComponent } from './components/add-book-form/add-book-form.component';
import { AddBookPageComponent } from './containers/add-book-page/add-book-page.component';

@NgModule({
  imports: [CommonModule, AddBookRoutingModule],
  declarations: [AddBookPageComponent, AddBookFormComponent]
})
export class AddBookModule {}
