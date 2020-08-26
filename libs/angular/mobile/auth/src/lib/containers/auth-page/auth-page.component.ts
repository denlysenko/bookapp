import { Component } from '@angular/core';

import { AuthPageBase } from '@bookapp/angular/base';
import { RouterExtensions } from '@bookapp/angular/core';
import { AuthFacade } from '@bookapp/angular/data-access';

import { Page } from 'tns-core-modules/ui/page';

@Component({
  moduleId: module.id,
  selector: 'bookapp-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent extends AuthPageBase {
  constructor(public page: Page, authFacade: AuthFacade, routerExtensions: RouterExtensions) {
    super(authFacade, routerExtensions);
    page.actionBarHidden = true;
  }
}
