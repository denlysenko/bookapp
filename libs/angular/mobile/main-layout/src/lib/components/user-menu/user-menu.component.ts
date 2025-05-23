import { ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA, output } from '@angular/core';

import { userMenu } from '@bookapp/shared/constants';

import { NativeScriptCommonModule, NSRouterLink, NSRouterLinkActive } from '@nativescript/angular';

@Component({
  selector: 'bookapp-user-menu',
  imports: [NSRouterLink, NSRouterLinkActive, NativeScriptCommonModule],
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [NO_ERRORS_SCHEMA],
})
export class UserMenuComponent {
  readonly logout = output();
  readonly userMenu = userMenu;
}
