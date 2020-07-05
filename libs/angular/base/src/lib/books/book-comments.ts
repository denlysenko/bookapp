import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { Comment } from '@bookapp/shared';

@Directive()
export abstract class BookCommentsBase {
  text = '';

  @Input() loading: boolean;
  @Input() comments: Comment[];

  @Output() commentAdded = new EventEmitter<string>();
}
