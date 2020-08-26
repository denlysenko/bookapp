import { Component } from '@angular/core';

import { AuthPageBase } from '@bookapp/angular/base';
import { RouterExtensions } from '@bookapp/angular/core';
import { AuthFacade } from '@bookapp/angular/data-access';

@Component({
  selector: 'bookapp-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent extends AuthPageBase {
  constructor(authFacade: AuthFacade, routerExtensions: RouterExtensions) {
    super(authFacade, routerExtensions);
  }
}
