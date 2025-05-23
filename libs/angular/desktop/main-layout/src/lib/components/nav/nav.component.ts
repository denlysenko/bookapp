import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatListModule } from '@angular/material/list';

import { DateToPeriodPipe } from '@bookapp/angular/shared';
import { categories, navs } from '@bookapp/shared/constants';
import { ROLES, UserActionsDesc } from '@bookapp/shared/enums';
import { Log, User } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-nav',
  imports: [MatListModule, RouterLink, RouterLinkActive, DateToPeriodPipe],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  readonly user = input<User>();
  readonly logs = input<Log[]>();

  readonly navMenu = navs;
  readonly categoryMenu = categories;
  readonly actions = UserActionsDesc;

  readonly isAdmin = computed(() => this.user().roles.includes(ROLES.ADMIN));
}
