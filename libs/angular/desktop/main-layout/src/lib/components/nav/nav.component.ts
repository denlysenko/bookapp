import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { categories, navs } from '@bookapp/angular/core';
import { Log, ROLES, User, UserActionsDesc } from '@bookapp/shared/models';

import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'bookapp-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
  readonly navMenu = navs;
  readonly categoryMenu = categories;
  readonly actions = UserActionsDesc;

  @Input()
  set user(user: User) {
    if (user) {
      this.isAdmin.next(user.roles.includes(ROLES.ADMIN));
    }
  }

  @Input()
  logs: Log[];

  get isAdmin$(): Observable<boolean> {
    return this.isAdmin.asObservable();
  }

  private isAdmin = new BehaviorSubject<boolean>(false);
}
