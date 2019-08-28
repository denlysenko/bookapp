import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { categories, navs } from '@bookapp/angular/shared';
import { Log, UserActionsDesc } from '@bookapp/shared/models';

@Component({
  moduleId: module.id,
  selector: 'bookapp-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppMenuComponent {
  readonly navMenu = navs;
  readonly categoryMenu = categories;
  readonly actions = UserActionsDesc;

  @Input()
  logs: Log[];
}
