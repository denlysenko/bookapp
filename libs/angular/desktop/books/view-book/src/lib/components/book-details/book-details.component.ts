import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BookDetailsBase } from '@bookapp/angular/base';
import { ROLES } from '@bookapp/shared/enums';
import { Book, User } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsComponent extends BookDetailsBase {
  @Input()
  set user(user: User) {
    if (user) {
      this._isAdmin = user.roles.includes(ROLES.ADMIN);
    }
  }

  @Output()
  paymentRequested = new EventEmitter<Book>();

  private _isAdmin: boolean;

  get isAdmin(): boolean {
    return this._isAdmin;
  }
}
