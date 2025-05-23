import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NO_ERRORS_SCHEMA,
  viewChild,
} from '@angular/core';

import { BookCommentsBase } from '@bookapp/angular/base';

import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

@Component({
  selector: 'bookapp-book-comments',
  imports: [NativeScriptCommonModule, NativeScriptFormsModule, DatePipe],
  templateUrl: './book-comments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class BookCommentsComponent extends BookCommentsBase {
  readonly listView = viewChild<ElementRef>('listView');
  readonly textView = viewChild<ElementRef>('textView');

  submitComment() {
    this.commentAdded.emit(this.text);
    this.text = '';
    this.textView()?.nativeElement.dismissSoftInput();

    setTimeout(() => {
      this.listView()?.nativeElement.scrollToIndex(this.comments.length - 1);
    }, 200);
  }
}
