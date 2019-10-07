import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BookCommentsBase } from '@bookapp/angular/base';

@Component({
  selector: 'bookapp-book-comments',
  templateUrl: './book-comments.component.html',
  styleUrls: ['./book-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookCommentsComponent extends BookCommentsBase {}
