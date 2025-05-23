import { Directive, input, output } from '@angular/core';

import { Comment } from '@bookapp/shared/interfaces';

@Directive()
export abstract class BookCommentsBase {
  readonly loading = input(false);
  readonly comments = input<Comment[]>();

  readonly commentAdded = output<string>();

  text = '';
}
