import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BookDetailsBase } from '@bookapp/angular/base';
import { ROLES, User } from '@bookapp/shared';

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

  private _isAdmin: boolean;

  get isAdmin(): boolean {
    return this._isAdmin;
  }
}
