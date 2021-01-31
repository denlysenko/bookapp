import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { categories, navs } from '@bookapp/shared/constants';

import { UserActionsDesc } from '@bookapp/shared/enums';
import { Log } from '@bookapp/shared/interfaces';

@Component({
  moduleId: module.id,
  selector: 'bookapp-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppMenuComponent {
  readonly navMenu = navs;
  readonly categoryMenu = categories;
  readonly actions = UserActionsDesc;

  @Input()
  logs: Log[];
}
