import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { RatingModule } from '@bookapp/angular/ui-desktop';

import { BookCommentsComponent } from './components/book-comments/book-comments.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { ViewBookPageComponent } from './containers/view-book-page/view-book-page.component';
import { ViewBookRoutingModule } from './view-book-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ViewBookRoutingModule,
    FormsModule,
    RouterModule,
    RatingModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [ViewBookPageComponent, BookDetailsComponent, BookCommentsComponent]
})
export class ViewBookModule {}
