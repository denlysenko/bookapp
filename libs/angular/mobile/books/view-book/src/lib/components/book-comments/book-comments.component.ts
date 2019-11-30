import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { BookCommentsBase } from '@bookapp/angular/base';

@Component({
  selector: 'bookapp-book-comments',
  templateUrl: './book-comments.component.html',
  styleUrls: ['./book-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookCommentsComponent extends BookCommentsBase {
  @ViewChild('listView', { static: false }) listView: ElementRef;
  @ViewChild('textView', { static: false }) textView: ElementRef;

  submitComment() {
    this.commentAdded.emit(this.text);
    this.text = '';
    this.textView.nativeElement.dismissSoftInput();

    setTimeout(() => {
      this.listView.nativeElement.scrollToIndex(this.comments.length - 1);
    }, 200);
  }
}
