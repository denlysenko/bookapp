import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  DialogsModule,
  FileSelectorModule,
  ImageSelectorModule,
} from '@bookapp/angular/ui-desktop';

import { AddBookRoutingModule } from './add-book-routing.module';
import { AddBookFormComponent } from './components/add-book-form/add-book-form.component';
import { AddBookPageComponent } from './containers/add-book-page/add-book-page.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddBookRoutingModule,
    ImageSelectorModule,
    FileSelectorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    DialogsModule,
  ],
  declarations: [AddBookPageComponent, AddBookFormComponent],
})
export class AddBookModule {}
