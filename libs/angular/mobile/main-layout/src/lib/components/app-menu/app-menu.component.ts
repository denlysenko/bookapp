import { ChangeDetectionStrategy, Component, input, NO_ERRORS_SCHEMA } from '@angular/core';

import { NativeScriptCommonModule, NSRouterLink, NSRouterLinkActive } from '@nativescript/angular';

import { DateToPeriodPipe } from '@bookapp/angular/shared';
import { categories, navs } from '@bookapp/shared/constants';
import { UserActionsDesc } from '@bookapp/shared/enums';
import { Log } from '@bookapp/shared/interfaces';

@Component({
  selector: 'bookapp-app-menu',
  imports: [NativeScriptCommonModule, NSRouterLink, NSRouterLinkActive, DateToPeriodPipe],
  templateUrl: './app-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppMenuComponent {
  readonly logs = input<Log[]>();
  readonly navMenu = navs;
  readonly categoryMenu = categories;
  readonly actions = UserActionsDesc;
}
