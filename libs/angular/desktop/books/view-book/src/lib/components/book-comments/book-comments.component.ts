import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { BookCommentsBase } from '@bookapp/angular/base';

@Component({
  selector: 'bookapp-book-comments',
  imports: [
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
  ],
  templateUrl: './book-comments.component.html',
  styleUrls: ['./book-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCommentsComponent extends BookCommentsBase {}
