import { EventEmitter, Input, Output } from '@angular/core';

import { Comment } from '@bookapp/shared';

export abstract class BookCommentsBase {
  text = '';

  @Input() loading: boolean;
  @Input() comments: Comment[];

  @Output() commentAdded = new EventEmitter<string>();
}
